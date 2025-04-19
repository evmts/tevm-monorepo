# Android Deployment Guide

**Introduction:** This guide walks you through deploying the **Krome** app (built with Tauri 2.0) on Android devices. We’ll cover setting up your development environment, building and packaging the Tauri app for Android, releasing it on the Google Play Store, alternative distribution options, the Play Store review process, common pitfalls, and CI/CD considerations. The guide assumes you’re comfortable with web development and tooling, but new to mobile development.

## Setting Up the Android Development Environment

Before building for Android, you need to prepare your system with the proper tools and SDKs:

1. **Install Rust and Tauri CLI:** Ensure you have Rust installed (use `rustup` to get the stable toolchain) and the Tauri CLI 2.x. (If you’ve developed a Tauri desktop app, you likely have these already.) On Windows, use the MSVC toolchain as default ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=MSVC%20Rust%20toolchain%20is%20the,msvc)). Confirm Rust is installed by running `rustc --version`.  
2. **Install Node.js (if using a frontend framework):** If your Tauri app uses a frontend framework (React, Vue, Svelte, etc.), install Node.js LTS. This provides you with `npm` or `yarn` for building the web assets ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=Only%20if%20you%20intend%20to,use%20a%20JavaScript%20frontend%20framework)) ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=2,successfully%20installed%20by%20running)). If your app is HTML/CSS/JS without a Node build step, Node isn’t strictly required.  
3. **Install Android Studio and SDK Tools:** Download and install **Android Studio** from Google’s developer site ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=1,environment%20variable)). Android Studio includes the Android SDK Manager. After installation, set the `JAVA_HOME` environment variable to use the JDK that comes with Android Studio (this is required for building) ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=Terminal%20window)). For example: 

   - On macOS: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"` ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=Terminal%20window))  
   - On Windows (PowerShell): `Set-EnvironmentVariable "JAVA_HOME" "C:\Program Files\Android\Android Studio\jbr"` ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=Terminal%20window))  

4. **Install Android SDK Packages:** Open **Android Studio > SDK Manager** and install the following SDK components ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=3,Studio%20to%20install%20the%20following)):
   - **Android SDK Platform** (the API level for the Android version you target)
   - **Android SDK Platform-Tools** (ADB and fastboot, required for device communication)
   - **Android SDK Build-Tools** (compilers for building the APK)
   - **Android SDK Command-line Tools** (for Gradle builds and SDK manager usage)
   - **NDK (Side by side)** (the Native Development Kit, required for Rust cross-compilation)  
   Ensure these are installed for the Android API level you need. It’s recommended to use a recent API (Android 13 or 14) for development. You can enable “Show Package Details” in SDK Manager to pick specific versions if needed ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=,line%20Tools)). 
5. **Set Android Environment Variables:** After installing SDK components, set `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) to point to the SDK directory and `NDK_HOME` to the NDK path ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=Terminal%20window)) ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=export%20ANDROID_HOME%3D)). For example on macOS/Linux: 

   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"  
   export NDK_HOME="$ANDROID_HOME/ndk/$(ls -1 $ANDROID_HOME/ndk)"
   ``` 

   On Windows, set the user environment variables `ANDROID_HOME` and `NDK_HOME` via the System Properties or PowerShell ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=Terminal%20window)). (You may need to restart your terminal or PC after this so the variables take effect ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=Tip)).) 
6. **Add Rust targets for Android:** Using `rustup`, add the Android architectures you want to support. Tauri uses four Android targets – arm64, armv7, x86, and x86_64. Run: 

   ```bash
   rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
   ``` 

   This installs the Rust standard libraries for those targets ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=5,rustup)), allowing you to compile Rust code for Android devices.

7. **Configure Tauri for Mobile (if not already):** In your Tauri project, if you haven’t initialized for Android, run the Tauri CLI to do so. Navigate to your project directory and execute: `npm run tauri android init` (or the equivalent Yarn/Pnpm/Cargo command). This generates the Android project structure (under `src-tauri/gen/android`) and configuration needed for building ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=Changing%20App%20Icon)). It may also prompt for the app identifier (e.g. `com.mycompany.krome`) and install any needed toolchains. You only need to do this once per project.

**Android Emulators:** Android Studio comes with the **AVD Manager** (Android Virtual Device Manager) to create emulator images. Launch AVD Manager via **Tools > Device Manager** in Android Studio and create a new virtual device (e.g. a Pixel 6 phone with Android 13). Choose a system image (x86_64 images run faster on Intel/AMD CPUs with virtualization). After creation, you can start the emulator from Android Studio. Tauri’s dev command will detect if an emulator is running or a device is connected and deploy to it ([Announcing the Tauri Mobile Alpha Release | Tauri](https://v2.tauri.app/blog/tauri-mobile-alpha/#:~:text=You%20can%20adapt%20your%20existing,starts%20an%20emulator%20if%20available)). If no emulator is running and no device is connected, Tauri can attempt to start an emulator for you (assuming one is configured).

**Real Device Testing:** You can also test on a physical Android device. On your Android phone/tablet, enable **Developer Options** by going to **Settings > About Phone** and tapping the **Build Number** 7 times. Then in **Developer Options**, enable **USB Debugging** ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=The%20inspector%20is%20enabled%20by,and%20the%20Developer%20Options%20settings)). Connect your device via USB; you may need to confirm a security prompt on the device to trust the computer. Ensure the device is recognized by running `adb devices` (which should list your device). Once set up, you can use `npm run tauri android dev` to run the app on the device (the Tauri CLI uses ADB under the hood to install and launch the app on your device or emulator).

## Building and Packaging the Tauri App for Android

With the environment ready, you can build the Krome app for Android. Tauri leverages an Android Gradle project internally, so the process will produce an APK (Android app package) or AAB (Android App Bundle) similar to any native Android app.

- **Development Build (Debug):** During development, use the command `tauri android dev`. This compiles the Rust code for Android (in debug mode) and deploys the app to your connected device/emulator with a debug signer. It works much like running a React Native or Flutter app in debug mode – you get a quick way to iterate. On first run, this will take some time to compile, but subsequent builds are faster ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=The%20first%20time%20you%20run,only%20your%20code%20needs%20rebuilding)) ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=cargo%20tauri%20%5Bandroid)). By default, the app will open on the device/emulator once built.

- **Production Build (Release):** When you’re ready to create a release build, run the command: `tauri android build`. This will compile a release version of your app. By default it produces a **universal APK** (supporting all CPU architectures) that is unsigned. You can also instruct Tauri to build an App Bundle (AAB), which is required for Play Store uploads ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=You%20can%20build%20an%20Android,by%20running%20the%20following%20command)) ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=npm%20run%20tauri%20android%20build,aab)). For example, run: 

  ```bash
  npm run tauri android build -- --aab
  ``` 

  This generates an Android App Bundle file for your app ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=You%20can%20build%20an%20Android,by%20running%20the%20following%20command)) ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=npm%20run%20tauri%20android%20build,aab)). The output artifacts are usually placed in `src-tauri/gen/android/app/` (look for `app-universal-release.aab` or `.apk`). Tauri’s build will automatically include all four architectures in the binary by default, unless you specify otherwise. You can limit to specific CPU architectures using the `--target` flag (e.g. `--target aarch64` for arm64 only) ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=Architecture%20selection)) ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=By%20default%20Tauri%20builds%20your,target%60%20argument)), but generally a universal build is fine for distribution. 

- **Code Signing (Android):** Android **requires that all apps be digitally signed with a certificate** before they can be installed ([Bad Certificate Management in Google Play Store](https://unit42.paloaltonetworks.com/bad-certificate-management-google-play-store/#:~:text=All%20Android%20apps%20must%20be,whether%20that%20developer%20is%20a)). During development (`tauri android dev`), a debug keystore is used automatically (Android Studio/Gradle provides a default debug key). However, the release APK/AAB you built is unsigned. To install it on devices or upload to the Play Store, you must sign it with a **release keystore**. You can generate a keystore using the `keytool` command (for example: `keytool -genkeypair -alias myapp -keyalg RSA -keysize 2048 -validity 9125 -keystore myapp.keystore` to create a key valid for 25 years). Once you have a keystore (a `.keystore` or `.jks` file) and its password, you need to configure the Tauri Android project to use it. 

  In the Android project (under `src-tauri/gen/android`), Tauri should provide a Gradle config for signing. Follow the Tauri docs or Android docs to set up **Gradle signing configs** using your keystore file, alias, and passwords ([Bad Certificate Management in Google Play Store](https://unit42.paloaltonetworks.com/bad-certificate-management-google-play-store/#:~:text=All%20Android%20apps%20must%20be,whether%20that%20developer%20is%20a)). This typically involves editing `android/app/build.gradle` to define a signing config for the release build. Alternatively, you can manually sign the APK using `jarsigner` and `zipalign` tools, but integrating it in Gradle is easier for repeatable builds. **Important:** Keep your keystore file safe and back it up – you’ll need the same key for future app updates to maintain the app’s identity ([Bad Certificate Management in Google Play Store](https://unit42.paloaltonetworks.com/bad-certificate-management-google-play-store/#:~:text=All%20Android%20apps%20must%20be,whether%20that%20developer%20is%20a)).

- **App Versioning:** Ensure your Tauri `tauri.conf.json` has proper version information. Tauri uses the `version` field to derive the Android version code by default (version code is an integer required by Android) ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=cargo%20tauri%20android%20build%20)) ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=Tauri%20derives%20the%20version%20code,sequential%20codes)). You can override this if needed in the config. Every time you upload a new build to Google Play, the version code must increase, so plan your versioning accordingly.

## Steps to Publish on the Google Play Store

Publishing to Google Play involves creating a developer account and an app listing:

1. **Enroll in Google Play Developer Program:** If you haven’t already, create a Google Play Developer account. This has a one-time $25 registration fee. Once registered, you can create and manage apps in the [Play Console](https://play.google.com/console) ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=Requirements)).

2. **Create an App Listing:** In the Play Console, click “Create App” and fill out the initial details (app name, default language, app category, etc.) ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=Once%20you%E2%80%99ve%20created%20a%20Play,required%20forms%20and%20setup%20tasks)). You will need to specify whether your app is free or paid, and other settings. Google will then present a dashboard of tasks required before you can publish:
   - **Store Listing:** Prepare your app’s description, screenshots, hi-res icon, feature graphic, etc.
   - **Content Rating:** Complete a questionnaire about your app’s content (for age rating).
   - **Data Safety form:** Declare what user data your app collects and how it’s used (a newer requirement).
   - **Privacy Policy:** If your app collects personal data or requires certain permissions, provide a privacy policy URL.
   - **App Content:** Acknowledge guidelines on ads, intellectual property, etc., and provide any required documentation (for example, if your app uses encryption or is for a specific age group).

3. **Upload the App Bundle (AAB):** Google Play **requires new apps to be uploaded as an Android App Bundle (.aab)** rather than an APK ([About Android App Bundles  |  Google Play  |  Android Developers](https://developer.android.com/guide/app-bundle#:~:text=Important%3A%20From%20August%202021%2C%20new,new%20and%20existing%20%20193)). In the Play Console “Release” section, create a new release (for internal testing or production rollout), and upload the AAB file generated by Tauri ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=You%20can%20build%20an%20Android,by%20running%20the%20following%20command)) ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=npm%20run%20tauri%20android%20build,aab)). If you opted into **Play App Signing**, you’ll upload an unsigned or debug-signed AAB and Google will handle final signing. Otherwise, ensure your AAB/APK is signed with your release keystore before uploading (the Play Console will reject unsigned artifacts).

4. **Internal Testing (Optional but Recommended):** Google Play allows you to first publish to an **internal test track** or **closed testing** track. This is a good practice to distribute the app to a few testers via the Play Store to verify everything (especially the download/installation process and that the app works in release mode). You can promote builds from internal testing to wider release if all looks good. For internal testing, you just add tester emails or Google Groups and release the app to that track (it’s not publicly visible).

5. **Publish to Production:** Once you have completed all required tasks in the Play Console (all checkmarks green) and are confident in your build, you can submit the app for review and rollout to the **Production** track. Set a rollout percentage if you want a staged rollout (e.g. 10% of users at first) or 100% for full release. Then confirm release. The app status will change to “Pending publication” and it will undergo Google’s review.

6. **Review and Approval:** Google’s review process is usually faster and less stringent than Apple’s. Many apps get approved within hours, though Google notes it **can take up to 7 days or longer** for some apps (especially for first-time publishers) ([App Reviews Taking Extremely Long Time? - Google Help](https://support.google.com/googleplay/android-developer/thread/256146314/app-reviews-taking-extremely-long-time?hl=en#:~:text=App%20Reviews%20Taking%20Extremely%20Long,)) ([App review time - Google Play Developer Community](https://support.google.com/googleplay/android-developer/community-guide/244499850/app-review-time?hl=en#:~:text=The%20documentation%20says%20that%20an,is%20often%20a%20lot%20faster)). You will receive an email if the app is approved and published, or if it’s rejected for policy violations. Common issues that trigger review delays or rejection include inappropriate content, copyright/IP issues, or violating the Developer Policy (for example, use of restricted permissions without justification).

7. **Post-Publication:** After approval, your app will be live on the Play Store for users to download. Monitor the **Crashes & ANRs** and user reviews/ratings in Play Console. You can push updates by increasing your app version and uploading a new AAB, which will also go through a review (usually quicker for updates).

## Alternative Distribution Methods (APK Sideloading and Others)

Not all Android apps are distributed via the Play Store. Alternative methods include:

- **Direct APK Distribution:** You can take the APK file (signed with your release key) and distribute it directly to users (for instance, via your website, email, or an alternate app store). Users will need to **enable installs from unknown sources** on their device to sideload the app. Modern Android versions will prompt the user to allow the specific app (e.g. their browser or file manager) to install unknown apps. Sideloading is useful for internal testing or distributing apps privately, but comes with challenges: users won’t get automatic updates (you’d have to provide updates manually) and some may be wary of installing apps outside the Play Store.

- **Alternative App Stores:** You could publish your app on other stores like the Amazon Appstore, Samsung Galaxy Store, or F-Droid (if your app is open-source). Each store has its own submission process and requirements. For example, Amazon’s store accepts standard APKs. Keep in mind these stores may not support all of Google Play Services features.

- **Enterprise Distribution:** For an organization distributing an app internally (e.g., to employees only), Google offers managed Play Store distribution or private app publishing. There’s also the Android Enterprise program and Mobile Device Management (MDM) solutions which can push internal apps to company devices without a public listing.

- **ADB Installation for Development:** For quick iterations or automated tests, you can install the APK on a device via `adb install yourapp.apk`. This is mostly a dev technique and not user-friendly for broad distribution.

In summary, the Play Store is the primary channel for reaching Android users, but APK distribution gives you flexibility for small-scale sharing or specific use cases (with the trade-off that users have to manually install and update the app).

## Google Play Store Review Process and Tips for Approval

Google’s review focuses on basic security/safety checks and policy compliance. Here’s what to expect and tips to ensure a smooth approval:

- **Review Time:** Many apps are approved within a day or two. Google even claims many submissions are reviewed much faster (hours). However, as a new developer account, your first app might undergo longer manual review. The Play Console will show the app status as "Under review". Generally, **app review can take 7 days or longer in some cases, though often it is a lot faster** ([App review time - Google Play Developer Community](https://support.google.com/googleplay/android-developer/community-guide/244499850/app-review-time?hl=en#:~:text=The%20documentation%20says%20that%20an,is%20often%20a%20lot%20faster)). Be patient and avoid repeatedly resubmitting, which can reset the review queue.

- **Automated Checks:** Upon upload, Google Play performs automated scans (for malware, viruses, or using forbidden APIs). Since Tauri apps are essentially native code with a WebView, ensure you’re not accidentally bundling any malware. It’s rare, but if your app uses native libraries, make sure they are from reputable sources.

- **Content Policy Compliance:** Google’s content policies forbid things like sexual content, hate speech, harassment, extreme violence, etc., and have restrictions on things like gambling or financial services. Make sure your app content and description adhere to these guidelines. **Tip:** Ensure your app’s description and screenshots accurately represent the content and functionality, as misleading content can cause issues.

- **Privacy and Data Use:** If your app collects personal data (location, contacts, etc.), make sure you have a privacy policy and that you’ve filled out the Play Console’s Data Safety section truthfully. Google may reject or flag apps that appear to collect sensitive data without disclosure. Also, requesting permissions (like GPS, camera, etc.) that are not obviously needed by your app can raise red flags. Only request permissions that your app absolutely requires.

- **Stability:** Test the release build on multiple devices if possible. An app that crashes frequently or doesn’t function (e.g., blank screen) is likely to get negative attention and could be rejected during review or receive bad user reviews post-launch. Google’s review may not catch every bug, but they do use pre-launch reports (which automatically test your app on various devices and provide crash reports in the Play Console).

- **Tips for Faster Approval:** 
  - Complete all the listing details and questionnaires accurately. An incomplete content rating or missing privacy policy can delay approval.
  - If your app has user-generated content or social features, have a plan for moderation (some content questions in the review ask about this).
  - Monitor your email for any feedback from Google. If they require changes, they will usually cite a specific policy section. Address the issue, upload a new build if needed, and resubmit.

Overall, Google’s process is developer-friendly. Once approved, updates typically go through quicker. Keep your developer reputation positive by adhering to policies to avoid suspensions.

## Common Pitfalls and Troubleshooting (Android)

Deploying to Android with Tauri can involve a lot of moving parts. Here are common pitfalls and how to solve them:

- **Environment Variable Issues:** A frequent setup problem is forgetting to set `ANDROID_HOME` or `NDK_HOME`, or having them point to the wrong directory. This can lead to errors like “SDK not found” or “NDK not configured”. Double-check those paths if you encounter build errors. The Tauri prerequisites guide emphasizes setting these properly ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=4.%20Set%20,environment%20variables)) ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=export%20ANDROID_HOME%3D)).

- **Licenses Not Accepted:** If you see build errors about Android SDK licenses (common in CI environments), you need to accept the licenses. On a dev machine, opening Android Studio will usually prompt you to accept SDK licenses. On CI or command-line, run: `sdkmanager --licenses` and accept the prompts.

- **`tauri android init` not run:** If you try `tauri android dev` or `build` and it errors out with messages about missing Android project or “directory src-tauri/gen/android doesn’t exist”, it means you need to run `tauri android init` first ([Troubleshooting | p2p Shipyard - darksoil studio](https://darksoil.studio/p2p-shipyard/documentation/troubleshooting.html#:~:text=Troubleshooting%20%7C%20p2p%20Shipyard%20,It%20means%20you%20haven%27t)) ([[bug] Android 'getting started' guide steps fail with no error message ...](https://github.com/tauri-apps/tauri/issues/12010#:~:text=,app%2Fsrc)). Always init the project for Android once, so the Gradle project is set up.

- **Gradle Build Failures:** If the Rust code compiles but the Gradle build fails, inspect the error. Sometimes missing SDK components (e.g., build-tools for a specific API level) can cause this – open SDK Manager and ensure the required build tools are installed. If you see an error about `compileSdkVersion` or `targetSdkVersion`, you might need to update your SDK to that API level or adjust the `android/gradle.properties` config that Tauri generated.

- **App Installation Failures:** If the APK builds but won’t install on a device (e.g., you get “App not installed” error), ensure it’s signed. An unsigned release APK will not install. You can test install a release APK by manually signing it with your debug keystore for a quick check, or better, set up a proper release signing config. Also ensure the app’s package identifier (e.g., `com.mycompany.krome`) is unique on the device – if you already have a debug version installed with a different signature, you may need to uninstall it first due to signature mismatch.

- **Emulator Issues:** If the Android emulator fails to launch or is very slow: Make sure Intel HAXM or AMD Hypervisor is installed (for x86 images) or use an ARM image on Apple Silicon Macs. If using WSL2 on Windows, note that WSL2 and Android Emulator might conflict with Hyper-V – you may prefer the Google Play SDK’s “WSA” or use a physical device in that case.

- **Tauri-Specific Considerations:** Some Tauri plugins or APIs might not yet be fully supported on mobile (as Tauri 2.0 is relatively new). If you encounter a plugin not working, check Tauri’s mobile plugin documentation or GitHub issues. You might need to disable or conditionally compile certain desktop-only features when targeting Android ([Building Next-Gen Cross-Platform Apps with Tauri 2.0 by Devlin ...](https://www.youtube.com/watch?v=0pae0HlNMy4#:~:text=Building%20Next,Whether%20you%27re)).

- **Using Android Studio for Debugging:** If you prefer a GUI debugger/logcat, you can open the generated Android project in Android Studio. Run `npm run tauri android dev -- --open` to open Android Studio with the project ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=,Studio)) ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=npm%20run%20tauri%20%5Bandroid,open)). Keep the Tauri CLI process running as it serves the backend. You can then use Android Studio’s tools (like Logcat to see console output or the debugger to set breakpoints in Java/Kotlin if needed).

- **ADB Connectivity:** If `tauri android dev` can’t find your device, verify that `adb devices` lists it. Sometimes on Windows, you may need to install the USB driver for your phone model. On Linux, add a udev rule for the device. Also ensure only one device/emulator is connected or specify which one if multiple (the CLI will usually prompt you to choose if multiple devices are available).

## CI/CD Setup (If Applicable)

Setting up Continuous Integration/Continuous Deployment for mobile can greatly streamline your releases. Here are some pointers:

- **CI for Android Builds:** You can use services like GitHub Actions, GitLab CI, CircleCI, etc., to automate Android builds. Use a Linux runner or a Mac runner (Android builds don’t strictly require macOS; Linux is fine). You’ll need to install the Android SDK and NDK in the CI environment and accept licenses. Google provides command-line SDK manager tools to do this. For example, on a CI run you might use `$ANDROID_HOME/tools/bin/sdkmanager` to install specific packages and then `$ANDROID_HOME/tools/bin/sdkmanager --licenses` to accept licenses. After setting up the environment (including Rust targets via rustup), run the same build command `tauri android build -- --aab`. This will output the AAB artifact, which you can have the CI upload as a build artifact or even directly push to Play Store.

- **Automating Play Store Releases:** Google offers an API for Play Store publishing. A common approach is to use **Fastlane** (a deployment automation tool). Fastlane’s `supply` tool can upload your AAB to the Play Store and even handle listing updates. Alternatively, GitHub Actions has community actions like `r0adkll/upload-google-play` that use service account credentials to upload to internal test tracks. For a simpler route, you might just have CI produce the build, and then you manually upload it via Play Console.

- **Managing Keystore in CI:** Never store your keystore and passwords in plain text in the repo. Use encrypted secrets in your CI platform to store the keystore file (you can base64 encode it and store the string, or use secure file storage if available) and the passwords. During the CI job, decode the keystore and use Gradle variables or environment variables for the passwords to sign the build. This way, your CI can produce a signed release build ready for distribution.

- **Continuous Delivery:** You might set up a workflow where every push to a `dev` branch triggers an internal test build (distributed to testers via a link or Play internal track), and every tagged release commit triggers a production release build that is uploaded to the Play Store (in a draft state for you to review and publish). This ensures a reliable and repeatable build process.

By automating builds and tests, you reduce human error and can catch issues early. Ensure you also run your test suites (if any) during CI – you can use Android emulators in CI or Firebase Test Lab to run instrumentation tests or simply ensure the app launches.

---

With the Android guide covered, you should be able to get the Krome app running on Android devices and published for users. Next, we’ll look at deploying the app on iOS, which has a different (and in some ways more involved) process.

