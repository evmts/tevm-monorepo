// SPDX-License-Identifier: GPL-3.0
// This contract is a slightly modified version of Péter Szilágyi's snailtracer.sol, licensed under GPL-3.0
// https://github.com/karalabe/snailtracer

contract SnailTracer {
  // Image properties for the path tracer
  int    width;  // Width of the image being generated, fixed for life
  int    height; // Height of the image being generated, fixed for life
  bytes  buffer; // Buffer to accumulate image traces (ephemeral)

  // Configure the scene for the tracer to render
  Ray        camera;    // Camera position for the image assembly
  Vector     deltaX;    // Horizontal FoV angle increment per image pixel
  Vector     deltaY;    // Vertical FoV andle increment per image pixel
  Sphere[]   spheres;   // Array of shperes defining the scene to render
  Triangle[] triangles; // Array of triangles defining the scene to render

  // TracePixel traces a single pixel of the configured image and returns the RGB
  // values to the caller. This method is meant to be used specifically for high
  // SPP renderings which would have a huge overhead otherwise.
  function TracePixel(int x, int y, int spp) constant returns (byte r, byte g, byte b) {
    Vector memory color = trace(x, y, spp);
    return (byte(color.x), byte(color.y), byte(color.z));
  }
  // TraceScanline traces a single horizontal scanline of the configured image and
  // returns the RGB pixel value array. This method should be used for lower SPP
  // rendering to void the overhead of by-pixel EVM calls.
  function TraceScanline(int y, int spp) constant returns (bytes) {
    for (int x = 0; x < width; x++) {
      Vector memory color = trace(x, y, spp);

      buffer.push(byte(color.x));
      buffer.push(byte(color.y));
      buffer.push(byte(color.z));
    }
    return buffer;
  }
  // TraceImage traces the entire image of the sconfigured scene and returns the
  // RGB pixel value array containing all the data top-down, left-to-right. This
  // method should only be callsed for very small images and SPP values as the
  // cumulative gas and memory costs can push the EVM too hard.
  function TraceImage(int spp) constant returns (bytes) {
    for (int y = height - 1; y >= 0; y--) {
      for (int x = 0; x < width; x++) {
        Vector memory color = trace(x, y, spp);

        buffer.push(byte(color.x));
        buffer.push(byte(color.y));
        buffer.push(byte(color.z));
      }
    }
    return buffer;
  }
  // Benchmark sets up an ephemeral image configuration and traces a select few
  // hand picked pixels to measure EVM execution performance.
  function Benchmark() constant returns (byte r, byte g, byte b) {
    // Configure the scene for benchmarking
    width = 1024; height = 768;

    // Initialize the rendering parameters
    camera = Ray(Vector(50000000, 52000000, 295600000), norm(Vector(0, -42612, -1000000)), 0, false);
    deltaX = Vector(width * 513500 / height, 0, 0);
    deltaY = div(mul(norm(cross(deltaX, camera.direction)), 513500), 1000000);

    // Initialize the scene bounding boxes
    spheres.push(Sphere(100000000000, Vector(100001000000, 40800000, 81600000), Vector(0, 0, 0), Vector(750000, 250000, 250000), Material.Diffuse));
    spheres.push(Sphere(100000000000, Vector(-99901000000, 40800000, 81600000), Vector(0, 0, 0), Vector(250000, 250000, 750000), Material.Diffuse));
    spheres.push(Sphere(100000000000, Vector(50000000, 40800000, 100000000000), Vector(0, 0, 0), Vector(750000, 750000, 750000), Material.Diffuse));
    spheres.push(Sphere(100000000000, Vector(50000000, 40800000, -99830000000), Vector(0, 0, 0), Vector(0, 0, 0), Material.Diffuse));
    spheres.push(Sphere(100000000000, Vector(50000000, 100000000000, 81600000), Vector(0, 0, 0), Vector(750000, 750000, 750000), Material.Diffuse));
    spheres.push(Sphere(100000000000, Vector(50000000, -99918400000, 81600000), Vector(0, 0, 0), Vector(750000, 750000, 750000), Material.Diffuse));

    // Initiallize the reflective sphere and the light source
    spheres.push(Sphere(16500000, Vector(27000000, 16500000, 47000000), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    spheres.push(Sphere(600000000, Vector(50000000, 681330000, 81600000), Vector(12000000, 12000000, 12000000), Vector(0, 0, 0), Material.Diffuse));
    //spheres.push(Sphere(16500000, Vector(73000000, 16500000, 78000000), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Refractive));

    // Ethereum logo fron triangles
    triangles.push(Triangle(Vector(56500000, 25740000, 78000000), Vector(73000000, 25740000, 94500000), Vector(73000000, 49500000, 78000000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    triangles.push(Triangle(Vector(56500000, 23760000, 78000000), Vector(73000000,        0, 78000000), Vector(73000000, 23760000, 94500000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    triangles.push(Triangle(Vector(89500000, 25740000, 78000000), Vector(73000000, 49500000, 78000000), Vector(73000000, 25740000, 94500000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    triangles.push(Triangle(Vector(89500000, 23760000, 78000000), Vector(73000000, 23760000, 94500000), Vector(73000000,        0, 78000000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));

    // Ethereum logo back triangles
    triangles.push(Triangle(Vector(56500000, 25740000, 78000000), Vector(73000000, 49500000, 78000000), Vector(73000000, 25740000, 61500000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    triangles.push(Triangle(Vector(56500000, 23760000, 78000000), Vector(73000000, 23760000, 61500000), Vector(73000000,        0, 78000000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    triangles.push(Triangle(Vector(89500000, 25740000, 78000000), Vector(73000000, 25740000, 61500000), Vector(73000000, 49500000, 78000000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    triangles.push(Triangle(Vector(89500000, 23760000, 78000000), Vector(73000000,        0, 78000000), Vector(73000000, 23760000, 61500000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));

    // Ethereum logo middle rectangles
    triangles.push(Triangle(Vector(56500000, 25740000, 78000000), Vector(73000000, 25740000, 61500000), Vector(89500000, 25740000, 78000000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    triangles.push(Triangle(Vector(56500000, 25740000, 78000000), Vector(89500000, 25740000, 78000000), Vector(73000000, 25740000, 94500000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    triangles.push(Triangle(Vector(56500000, 23760000, 78000000), Vector(89500000, 23760000, 78000000), Vector(73000000, 23760000, 61500000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));
    triangles.push(Triangle(Vector(56500000, 23760000, 78000000), Vector(73000000, 23760000, 94500000), Vector(89500000, 23760000, 78000000), Vector(0, 0, 0), Vector(0, 0, 0), Vector(999000, 999000, 999000), Material.Specular));

    // Calculate all the triangle surface normals
    for (uint i=0; i<triangles.length; i++) {
      Triangle memory tri = triangles[i];
      triangles[i].normal = norm(cross(sub(tri.b, tri.a), sub(tri.c, tri.a)));
    }

    deltaX = Vector(width * 513500 / height, 0, 0);
    deltaY = div(mul(norm(cross(deltaX, camera.direction)), 513500), 1000000);

    // Trace a few pixels and collect their colors (sanity check)
    Vector memory color;

    color = add(color, trace(512, 384, 8)); // Flat diffuse surface, opposite wall
    color = add(color, trace(325, 540, 8)); // Reflective surface mirroring left wall
    color = add(color, trace(600, 600, 8)); // Refractive surface reflecting right wall
    color = add(color, trace(522, 524, 8)); // Reflective surface mirroring the refractive surface reflecting the light
    color = div(color, 4);

    return (byte(color.x), byte(color.y), byte(color.z));
  }
  // trace executes the path tracing for a single pixel of the result image and
  // returns the RGB color vector normalized to [0, 256) value range.
  function trace(int x, int y, int spp) internal returns (Vector color) {
    seed = uint32(y * width + x); // Deterministic image irrelevant of render chunks

    delete(color);
    for (int k=0; k<spp; k++) {
      Vector memory pixel = add(div(add(mul(deltaX, (1000000*x + rand()%500000)/width - 500000), mul(deltaY, (1000000*y + rand()%500000)/height - 500000)), 1000000), camera.direction);
      Ray    memory ray   = Ray(add(camera.origin, mul(pixel, 140)), norm(pixel), 0, false);

      color = add(color, div(radiance(ray), spp));
    }
    return div(mul(clamp(color), 255), 1000000);
  }
  // Trivial linear congruential pseudo-random number generator
  uint32 seed;
  function rand() internal returns (uint32) {
    seed = 1103515245 * seed + 12345;
    return seed;
  }
  // Clamp bounds an int value to the allowed [0, 1] range.
  function clamp(int x) internal returns (int) {
    if (x < 0) { return 0; }
    if (x > 1000000) { return 1000000; }
    return x;
  }
  // Square root calculation based on the Babylonian method
  function sqrt(int x) internal returns (int y) {
    int z = (x + 1) / 2;
    y = x;
    while (z < y) {
      y = z;
      z = (x/z + z) / 2;
    }
  }
  // Sine calculation based on Taylor series expansion.
  function sin(int x) internal returns (int y) {
    // Ensure x is between [0, 2PI) (Taylor expansion is picky with large numbers)
    while (x < 0) {
      x += 6283184;
    }
    while (x >= 6283184) {
      x -= 6283184;
    }
    // Calculate the sin based on the Taylor series
    int s = 1; int n = x; int d = 1; int f = 2;
    while (n > d) {
      y += s * n / d;
      n = n * x * x / 1000000 / 1000000;
      d *= f * (f + 1);
      s *= -1;
      f += 2;
    }
  }
  // Cosine calculation based on sine and Pythagorean identity.
  function cos(int x) internal returns (int) {
    int s = sin(x); return sqrt(1000000000000 - s*s);
  }
  // Abs returns the absolute value of x.
  function abs(int x) internal returns (int) {
    if (x > 0) {
      return x;
    }
    return -x;
  }
  // Vector definition and operations
  struct Vector {
    int x; int y; int z;
  }

  function add(Vector u, Vector v) internal returns (Vector) {
    return Vector(u.x+v.x, u.y+v.y, u.z+v.z);
  }
  function sub(Vector u, Vector v) internal returns (Vector) {
    return Vector(u.x-v.x, u.y-v.y, u.z-v.z);
  }
  function mul(Vector v, int m) internal returns (Vector) {
    return Vector(m*v.x, m*v.y, m*v.z);
  }
  function mul(Vector u, Vector v) internal returns (Vector) {
    return Vector(u.x*v.x, u.y*v.y, u.z*v.z);
  }
  function div(Vector v, int d) internal returns (Vector) {
    return Vector(v.x/d, v.y/d, v.z/d);
  }
  function dot(Vector u, Vector v) internal returns (int) {
    return u.x*v.x + u.y*v.y + u.z*v.z;
  }
  function cross(Vector u, Vector v) internal returns (Vector) {
    return Vector(u.y*v.z - u.z*v.y, u.z*v.x - u.x*v.z, u.x*v.y - u.y*v.x);
  }
  function norm(Vector v) internal returns (Vector) {
    int length = sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
    return Vector(v.x * 1000000 / length, v.y * 1000000 / length, v.z * 1000000 / length);
  }
  function clamp(Vector v) internal returns (Vector) {
    return Vector(clamp(v.x), clamp(v.y), clamp(v.z));
  }
  // Ray is a parametric line with an origin and a direction.
  struct Ray {
    Vector origin;
    Vector direction;
    int    depth;
    bool   refract;
  }
  // Material is the various types of light-altering surfaces
  enum Material { Diffuse, Specular, Refractive }

  // Primitive is the various types of geometric primitives
  enum Primitive { Sphere, Triangle }

  // Sphere is a physical object to intersect the light rays with
  struct Sphere {
    int      radius;
    Vector   position;
    Vector   emission;
    Vector   color;
    Material reflection;
  }

  // Triangle is a physical object to intersect the light rays with
  struct Triangle {
    Vector   a;
    Vector   b;
    Vector   c;
    Vector   normal;
    Vector   emission;
    Vector   color;
    Material reflection;
  }

  // intersect calculates the intersection of a ray with a sphere, returning the
  // distance till the first intersection point or zero in case of no intersection.
  function intersect(Sphere s, Ray r) internal returns (int) {
    Vector memory op = sub(s.position, r.origin);

    int b   = dot(op, r.direction) / 1000000;
    int det = b*b - dot(op, op) + s.radius*s.radius;

    // Bail out if ray misses the sphere
    if (det < 0) {
      return 0;
    }
    // Calculate the closer intersection point
    det = sqrt(det);
    if (b - det > 1000) {
      return b - det;
    }
    if (b + det > 1000) {
      return b + det;
    }
    return 0;
  }
  function intersect(Triangle t, Ray r) internal returns (int) {
    Vector memory e1 = sub(t.b, t.a);
    Vector memory e2 = sub(t.c, t.a);

    Vector memory p = cross(r.direction, e2);

    // Bail out if ray is is parallel to the triangle
    int det = dot(e1, p) / 1000000;
    if (det > -1000 && det < 1000) {
      return 0;
    }
    // Calculate and test the 'u' parameter
    Vector memory d = sub(r.origin, t.a);

    int u = dot(d, p) / det;
    if(u < 0 || u > 1000000) {
      return 0;
    }
    // Calculate and test the 'v' parameter
    Vector memory q = cross(d, e1);

    int v = dot(r.direction, q) / det;
    if(v < 0 || u + v  > 1000000) {
      return 0;
    }
    // Calculate and return the distance
    int dist = dot(e2, q) / det;
    if (dist < 1000) {
      return 0;
    }
    return dist;
  }
  function radiance(Ray ray) internal returns (Vector) {
    // Place a limit on the depth to prevent stack overflows
    if (ray.depth > 10) {
      return Vector(0, 0, 0);
    }
    // Find the closest object of intersection
    int dist; Primitive p; uint id; (dist, p, id) = traceray(ray);
    if (dist == 0) {
      return Vector(0, 0, 0);
    }
    Sphere   memory sphere;
    Triangle memory triangle;
    Vector   memory color;
    Vector   memory emission;

    if (p == Primitive.Sphere) {
      sphere   = spheres[id];
      color    = sphere.color;
      emission = sphere.emission;
    } else {
      triangle = triangles[id];
      color    = triangle.color;
      emission = triangle.emission;
    }
    // After a number of reflections, randomly stop radiance calculation
    int ref = 1;
    if (color.z > ref) {
      ref = color.z;
    }
    if (color.y > ref) {
      ref = color.y;
    }
    if (color.z > ref) {
      ref = color.z;
    }
    ray.depth++;
    if (ray.depth > 5) {
      if (rand() % 1000000 < ref) {
        color = div(mul(color, 1000000), ref);
      } else {
        return emission;
      }
    }
    // Calculate the primitive dependent radiance
    Vector memory result;
    if (p == Primitive.Sphere) {
      result = radiance(ray, sphere, dist);
    } else {
      result = radiance(ray, triangle, dist);
    }
    return add(emission, div(mul(color, result), 1000000));
  }
  function radiance(Ray ray, Sphere obj, int dist) internal returns (Vector) {
    // Calculate the sphere intersection point and normal vectors for recursion
    Vector memory intersect = add(ray.origin, div(mul(ray.direction, dist), 1000000));
    Vector memory normal    = norm(sub(intersect, obj.position));

    // For diffuse reflectivity
    if (obj.reflection == Material.Diffuse) {
      if (dot(normal, ray.direction) >= 0) {
        normal = mul(normal, -1);
      }
      return diffuse(ray, intersect, normal);
    } else { // For specular reflectivity
      return specular(ray, intersect, normal);
    }
  }
  function radiance(Ray ray, Triangle obj, int dist) internal returns (Vector) {
    // Calculate the triangle intersection point for refraction
    // We're cheating here, we don't have diffuse triangles :P
    Vector memory intersect = add(ray.origin, div(mul(ray.direction, dist), 1000000));

    // Calculate the refractive indices based on whether we're in or out
    int nnt = 666666; // (1 air / 1.5 glass)
    if (ray.refract) {
      nnt = 1500000; // (1.5 glass / 1 air)
    }
    int ddn = dot(obj.normal, ray.direction) / 1000000;
    if (ddn >= 0) {
      ddn = -ddn;
    }
    // If the angle is too shallow, all light is reflected
    int cos2t = 1000000000000 - nnt * nnt * (1000000000000 - ddn * ddn) / 1000000000000;
    if (cos2t < 0) {
      return specular(ray, intersect, obj.normal);
    }
    return refractive(ray, intersect, obj.normal, nnt, ddn, cos2t);
  }
  function diffuse(Ray ray, Vector intersect, Vector normal) internal returns (Vector) {
    // Generate a random angle and distance from center
    int r1 = int(6283184) * (rand() % 1000000) / 1000000;
    int r2 = rand() % 1000000; int r2s = sqrt(r2) * 1000;

    // Create orthonormal coordinate frame
    Vector memory u;
    if (abs(normal.x) > 100000) {
      u = Vector(0, 1000000, 0);
    } else {
      u = Vector(1000000, 0, 0);
    }
    u = norm(cross(u, normal));
    Vector memory v = norm(cross(normal, u));

    // Generate the random reflection ray and continue path tracing
    u = norm(add(add(mul(u, cos(r1) * r2s / 1000000), mul(v, sin(r1) * r2s / 1000000)), mul(normal, sqrt(1000000 - r2) * 1000)));
    return radiance(Ray(intersect, u, ray.depth, ray.refract));
  }
  function specular(Ray ray, Vector intersect, Vector normal) internal returns (Vector) {
    Vector memory reflection = norm(sub(ray.direction, mul(normal, 2 * dot(normal, ray.direction) / 1000000)));
    return radiance(Ray(intersect, reflection, ray.depth, ray.refract));
  }
  function refractive(Ray ray, Vector intersect, Vector normal, int nnt, int ddn, int cos2t) internal returns (Vector) {
    // Calculate the refraction rays for fresnel effects
    int sign = -1; if (ray.refract) { sign = 1; }
    Vector memory refraction = norm(div(sub(mul(ray.direction, nnt), mul(normal, sign * (ddn * nnt / 1000000 + sqrt(cos2t)))), 1000000));

    // Calculate the fresnel probabilities
    int c = 1000000 + ddn;
    if (!ray.refract) {
      c = 1000000 - dot(refraction, normal) / 1000000;
    }
    int re = 40000 + (1000000 - 40000) * c * c * c * c * c / 1000000000000000000000000000000;

    // Split a direct hit, otherwise trace only one ray
    if (ray.depth <= 2) {
      refraction = mul(radiance(Ray(intersect, refraction, ray.depth, !ray.refract)), 1000000 - re); // Reuse refraction variable (lame)
      refraction = add(refraction, mul(specular(ray, intersect, normal), re));
      return div(refraction, 1000000);
    }
    if (rand() % 1000000 < 250000 + re / 2) {
      return div(mul(specular(ray, intersect, normal), re), 250000 + re / 2);
    }
    return div(mul(radiance(Ray(intersect, refraction, ray.depth, !ray.refract)), 1000000 - re), 750000 - re / 2);
  }
  // traceray calculates the intersection of a ray with all the objects and
  // returns the closest one.
  function traceray(Ray ray) internal returns (int, Primitive, uint) {
    int dist = 0; Primitive p; uint id;

    // Intersect the ray with all the spheres
    for (uint i=0; i<spheres.length; i++) {
      int d = intersect(spheres[i], ray);
      if (d > 0 && (dist == 0 || d < dist)) {
        dist = d; p = Primitive.Sphere; id = i;
      }
    }
    // Intersect the ray with all the triangles
    for (i=0; i<triangles.length; i++) {
      d = intersect(triangles[i], ray);
      if (d > 0 && (dist == 0 || d < dist)) {
        dist = d; p = Primitive.Triangle; id = i;
      }
    }
    return (dist, p, id);
  }
}
