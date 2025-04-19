# iOS Deployment Guide

**Introduction:** Deploying the Krome app to iOS (iPhone/iPad) is a bit more involved due to Apple’s ecosystem requirements. This guide will cover setting up an iOS development environment, building the Tauri app for iOS, publishing on Apple’s App Store, alternative distribution options like TestFlight or Enterprise, the App Store review process, common pitfalls, and CI/CD for iOS. As before, we assume you know general development concepts but are new to iOS specifics.

## Setting Up the iOS Development Environment

Developing for iOS requires a Mac – Apple’s toolchain is only available on macOS ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=iOS)) ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=macOS%20Only)). Here are the steps to get ready:

1. **Use a Mac and Install Xcode:** Xcode is Apple’s IDE that includes the iOS SDK, Simulator, and necessary build tools. Install the latest **Xcode** from the Mac App Store or Apple’s developer website. (Xcode is large, ~10+ GB, and includes simulators for the latest iOS version by default.) After installation, open Xcode at least once to accept the license and install additional components. Ensure you also have Xcode Command Line Tools installed (you can install via running `xcode-select --install` in Terminal, though if Xcode is installed this is often already set up).

2. **Apple Developer Account:** Enroll in the Apple Developer Program (costs $99 per year) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=Requirements)). While you can run apps on your own device without a paid account (using a free provisioning profile, limited to certain testing constraints), to distribute via the App Store or TestFlight you **must** have a paid developer account ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=Distributing%20iOS%20and%20macOS%20apps,to%20the%20Apple%20Developer%20program)). Joining the program will give you access to App Store Connect and the ability to create distribution certificates, provisioning profiles, and upload apps. *(If you’re part of a team or company, you might be added to their developer team instead of using an individual account.)*

3. **Install Homebrew (optional but useful):** Homebrew is a package manager for macOS. It’s not strictly required, but Tauri’s docs suggest using it to install utilities like CocoaPods ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=1,in%20Terminal)) ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=%2Fbin%2Fbash%20)). Install Homebrew by running the script from brew.sh ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=rustup%20target%20add%20aarch64,sim)).

4. **Install CocoaPods:** CocoaPods is a dependency manager for iOS projects, often used to integrate libraries. Tauri uses CocoaPods to integrate the Swift libraries for the Tauri runtime. Install it by running `brew install cocoapods` ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=https%3A%2F%2Fraw.githubusercontent.com%2FHomebrew%2Finstall%2FHEAD%2Finstall.sh%29)). (Alternatively, `sudo gem install cocoapods` if you have Ruby environment, but Homebrew is simpler.) Once installed, you don’t need to run `pod install` yourself for Tauri; the Tauri CLI will handle it when initializing the iOS project.

5. **Add Rust targets for iOS:** Similar to Android, you need to add iOS targets to Rust. Run: 

   ```bash
   rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
   ``` 

   This prepares Rust for compiling to iPhone/iPad (arm64 for devices, x86_64 for Simulator, and a variant for Apple Silicon simulator) ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=1,in%20Terminal)) ([Prerequisites | Tauri](https://v2.tauri.app/start/prerequisites/#:~:text=1,in%20Terminal)). Apple Silicon Macs (M1/M2) run the iOS Simulator in arm64, but the `aarch64-apple-ios-sim` target covers that.

6. **Initialize Tauri for iOS:** In your Tauri project directory, run `npm run tauri ios init`. This will generate an Xcode project under `src-tauri/gen/apple/` configured for your app (with the bundle identifier, icons, etc.) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=Additionally%2C%20you%20must%20setup%20code,macOS%20%20and%20%2083)) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=After%20running%20,to%20update%20the%20app%20icons)). It sets up necessary files like an Xcode workspace, Info.plist, and linkages for the Tauri libraries. You should run this after you’ve installed CocoaPods, as it might run `pod install` to fetch iOS dependencies. Once done, you have an iOS project ready.

7. **Certificates and Provisioning (Development):** Apple’s code signing is a notorious hurdle for newcomers. Here’s a simplified approach:
   - Open the generated Xcode project (`src-tauri/gen/apple/Krome.xcodeproj` or `.xcworkspace` if pods are integrated). 
   - In Xcode, go to **Signing & Capabilities** for the project’s target. Ensure the **Bundle Identifier** matches what you intend (e.g., `com.mycompany.krome`). Set the **Team** to your Apple Developer team. If this is your first time, Xcode might prompt to sign in with your Apple ID.
   - With a team selected and “Automatically manage signing” enabled, Xcode will create a Development Certificate and a Provisioning Profile for you (if they don’t already exist). The provisioning profile will include your Mac (for Simulator) and any iOS devices registered to your account.
   - To run on a real iPhone/iPad, you must register that device’s UDID in the developer portal (Xcode can do this when you connect the device via USB and select it as a run target – it will ask to register the device). On iOS 16+, after deploying an app from Xcode, you also need to enable **Developer Mode** on the device (Settings > Privacy & Security > Developer Mode).

   In short, let Xcode handle the dev signing. If everything is set up, you should be able to plug in an iPhone, choose it in Xcode’s run target dropdown, and press the Run ▶️ button to build and install the app on the device.

## Building and Packaging the Tauri App for iOS

Building for iOS can be done via the Tauri CLI (which uses Xcode under the hood) or directly in Xcode. Let’s cover both:

- **Development Build (Simulator/Device):** During development, use `tauri ios dev`. This is analogous to the Android dev command – it compiles a debug build and launches it in an iOS Simulator by default ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=Developing%20your%20Mobile%20Application)). By default, it might pick a default simulator (like the latest iPhone model). You can specify a device name, e.g., `npm run tauri ios dev "iPhone 15"` to target a specific simulator by name ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=deno%20task%20tauri%20ios%20dev,iPhone%2015)). If you want to run on a physical device via CLI, you may need additional flags for host networking (Tauri dev server) – see Tauri documentation for `--host` usage ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=Note)) ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=)). However, many developers will simply open Xcode for device testing. You can run `tauri ios dev --open` which will build and then open the project in Xcode for you to use the GUI tools ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=,Studio)) ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=npm%20run%20tauri%20%5Bandroid,open)).

- **Release Build (Archive):** To prepare an App Store submission or TestFlight build, you need a release **IPA** (iOS app archive). Tauri CLI provides a convenient command: `tauri ios build`. This will produce a signed `.ipa` if configured correctly. For example: 

  ```bash
  npm run tauri ios build -- --export-method app-store-connect
  ``` 

  This tells Tauri to build for App Store Connect distribution ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=To%20build%20your%20iOS%20app%2C,command)) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=npm%20run%20tauri%20ios%20build,connect)). Under the hood, this likely performs an Xcode archive and export. The result IPA can be found in `src-tauri/gen/apple/build/arm64/Krome.ipa` (replace Krome with your app name) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=cargo%20tauri%20ios%20build%20,connect)) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=The%20generated%20IPA%20file%20can,tauri%2Fgen%2Fapple%2Fbuild%2Farm64%2F%24APPNAME.ipa)). If you omit `--export-method`, it might default to a development export. The export method “app-store-connect” means it’s suitable for TestFlight/App Store (requires a Distribution certificate). Ensure you have an Apple Distribution certificate and an App Store provisioning profile in place. If using Xcode automatic signing, Xcode will create an "iOS Distribution" certificate for you (you might need to refresh profiles). The first time, it might prompt for your developer account credentials to generate signing assets.

- **Alternative: Archive in Xcode:** If the CLI approach is troublesome (especially with code signing), you can archive manually:
  - Open the Xcode workspace (`.xcworkspace` if exists, else the `.xcodeproj`).
  - Select **Any iOS Device (arm64)** as the build target (or a generic device).
  - Product > Archive. This will build a release version and open the Organizer with the archive.
  - In Organizer, you can then Distribute the app: choose “App Store Connect > Upload” for TestFlight/App Store or “Enterprise/Ad Hoc > Export IPA” if using those methods.
  - Xcode will handle signing during this process (ensuring the archive is signed with your Distribution certificate if uploading to App Store).

- **App Identifier & Capabilities:** Make sure the bundle identifier in Tauri config (and thus Xcode) matches one you’ve registered in Apple’s Developer portal. If your app uses certain capabilities (like Push Notifications, Background modes, Keychain sharing, etc.), you’d enable those in Xcode’s Signing & Capabilities tab, which may update the provisioning profile.

- **Icons and Launch Screens:** Tauri’s `tauri ios init` will set up app icons and a default launch screen storyboard. If you want to update the app icon, you can use `tauri icon` command similar to Android (with an `--ios-color` for background color) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=Additionally%2C%20you%20must%20setup%20code,macOS%20%20and%20%2083)) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=npm%20run%20tauri%20icon%20%2Fpath%2Fto%2Fapp,color%20%23fff)). Apple requires every app to have an adaptive launch screen – by default Tauri provides one, so you should be fine.

At this point, you should have an IPA file ready or an archive prepared to upload.

## Steps to Publish on the Apple App Store

Publishing an iOS app involves more steps than Android, largely due to Apple’s stricter process:

1. **App Store Connect – Create App Record:** Log in to [App Store Connect](https://appstoreconnect.apple.com/) with your developer account. Go to “My Apps” and click the **"+"** to create a new app. You’ll need to fill in:
   - **Platform:** iOS (or iPadOS, which is included under iOS for most cases).
   - **Name:** The app name (this is what shows on the App Store; it must be unique across all apps).
   - **Bundle ID:** Choose the bundle identifier matching your app (it should appear in the dropdown if you registered it in the developer portal or via Xcode auto signing).
   - **SKU:** An internal ID you make up (can be anything unique in your account, e.g., “Krome001”).
   - **User Access:** Usually leave as full access unless you need to restrict visibility.

   This creates the app entry in App Store Connect. Initially, it will be missing most info (we’ll add those next).

2. **Upload Your Build:** There are two primary ways:
   - **Xcode Upload:** If you archived in Xcode, after Archive you can choose “Upload to App Store Connect”. This will automatically send the build to App Store Connect. If it succeeds, the build will appear under your app’s TestFlight tab (processing may take a few minutes).
   - **Transporter or altool:** You can use Apple’s Transporter app (a macOS app) to upload an IPA by signing in. Or use command-line `xcrun altool` with an App Store Connect API key ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=Now%20you%20can%20use%20the,app%20to%20the%20App%20Store)). Tauri’s docs show an example using `altool` with `--apiKey` and `--apiIssuer` to authenticate and upload the IPA ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=Now%20you%20can%20use%20the,app%20to%20the%20App%20Store)). This is useful for CI automation. For manual uploading, Xcode or Transporter is simpler.

   Once uploaded, the build will go through Apple’s processing (it checks the binary for symbols, swift versions, etc.). After processing, it will be available in App Store Connect’s **TestFlight** section and in the **App Store > App Versions** section to select for release.

3. **TestFlight (Optional Testing):** It’s highly recommended to use TestFlight to test your app with real users (or even just your own devices) before public release. In App Store Connect:
   - Enable TestFlight beta testing for the app. You can add **Internal testers** (up to 100 members of your App Store Connect team) almost immediately – they can download the app via TestFlight app without any further review.
   - For **External testers** (up to 10,000 people by email invitation or a public link), you need to submit the build for **Beta App Review** ([TestFlight overview - Test a beta version - App Store Connect - Help - Apple Developer](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/#:~:text=you%27ve%20added%20builds%20to%20a,your%20app%20to%20a%20group)). This is a shorter review mostly to check basic compliance. Once approved (usually within a day), external testers can install the app. You can send them an invite via TestFlight or share a public link. External testing is great for a larger beta group.
   - TestFlight builds expire after 90 days and are meant for testing only. But it’s a very useful step to catch issues and gather feedback.

4. **Prepare App Store Listing:** While testing, you can start filling out the App Store listing information in App Store Connect:
   - **Description, Keywords, Support URL, Marketing URL** (if any), etc.
   - **Screenshots:** You’ll need screenshots for various device sizes (at least for the 6.5" iPhone (iPhone Pro Max size) and 5.5" iPhone (iPhone 8 Plus size) – Apple requires those two as a minimum for iPhone apps). If your app supports iPad, you need iPad screenshots too (and possibly for different resolutions). You can use the iOS Simulator to take screenshots (Command+S in Simulator or use Xcode’s screenshot tool) in the required resolutions.
   - **App Icon (App Store Icon):** Provide a 1024x1024 PNG (this is separate from the in-app icon, and has no rounded corners).
   - **Categories:** Choose a primary (and optional secondary) category that fits your app (e.g., Productivity, Utilities, etc.).
   - **Rating:** Fill out the content rating questionnaire (similar to Google’s but Apple’s version).
   - **Privacy Policy URL:** Apple requires a privacy policy URL for any app that collects or transmits user data, and for all apps in general nowadays (especially if targeting kids or using certain frameworks). Even if not required, it’s good practice to have one.

5. **Submit for App Review:** Once your listing is complete and a build is uploaded (and you’re satisfied with testing), it’s time to submit to Apple’s review for App Store release. In App Store Connect:
   - Go to the **App Store** tab for your app, create a new **App Store version** (e.g., 1.0.0) if not already created.
   - Select the build you uploaded to attach to this version.
   - Fill in **What’s New** (for version update notes).
   - Ensure all fields are complete and no errors are shown in the form. Then click **Submit for Review** (or “Submit to App Review”).
   - You might be asked about encryption compliance (if your app uses encryption beyond HTTPS, you must answer yes and provide details or an exemption if eligible).
   - At this point, the app version status becomes “Waiting for Review”.

6. **App Store Review Process:** Now the waiting begins. Apple’s review can take anywhere from a day to a week, typically. Apple has stated that **90% of apps are reviewed within 24 hours** ([Apple Publishes New Webpages Explaining the Benefits of the App Store and the Company's Developer Program - MacStories](https://www.macstories.net/news/apple-publishes-new-webpages-explaining-the-benefits-of-the-app-store-and-the-companys-developer-program/#:~:text=,outside%20a%20developer%E2%80%99s%20local%20region)) ([Apple Publishes New Webpages Explaining the Benefits of the App ...](https://www.macstories.net/news/apple-publishes-new-webpages-explaining-the-benefits-of-the-app-store-and-the-companys-developer-program/#:~:text=,hours%3B%20500%20million%20people)), but in practice new developers or certain app categories might see a longer wait. You can check the status in App Store Connect; it will move to “In Review” when someone is actively reviewing it, then either approved or rejected. If approved, the status changes to “Ready for Sale” (if you chose automatic release) or “Pending Developer Release” (if you chose to release manually later).

7. **Publication:** If you chose automatic release, your app will typically appear on the App Store shortly after approval (may take an hour or so to propagate). If manual, you can go into App Store Connect and hit “Release” when you’re ready (useful if you want to coordinate release timing).

Throughout this process, Apple will email you for important events (approval or rejection). If rejected, they will provide a message (and sometimes guideline references, e.g. “Guideline 2.1 – Performance: App Completeness”). You have the opportunity to address the issues and resubmit. Use the **Resolution Center** in App Store Connect to communicate with Apple if needed (for example, if you disagree or need clarification, you can send a message there).

## Alternative Distribution Methods (TestFlight, Ad Hoc, Enterprise, Unlisted)

Apple provides a few ways to distribute apps outside the public App Store, suitable for various scenarios:

- **TestFlight (Beta Testing):** As discussed, TestFlight is Apple’s official beta distribution channel. You can invite up to **100 internal testers** (members of your team) and **10,000 external testers** for a beta ([TestFlight overview - Test a beta version - App Store Connect - Help - Apple Developer](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/#:~:text=you%27ve%20added%20builds%20to%20a,your%20app%20to%20a%20group)). This is ideal for testing with users before App Store release. TestFlight requires an App Store Connect upload and (for external testers) a beta review, but it’s much easier than distributing ad-hoc builds to individuals manually. TestFlight testers do not count against device limits and only need to install the TestFlight app and have an invite.

- **Ad Hoc Distribution:** Ad Hoc is a method to distribute an app to a limited number of devices (up to 100 devices per year per developer account) **without going through the App Store**. You still need to code sign the app with an Ad Hoc provisioning profile, which includes the UDIDs of the target devices. The steps: register the testers’ device UDIDs in your developer account, create an Ad Hoc provisioning profile for the app (with those devices), sign the app/archive with it, then export an IPA for Ad Hoc distribution. You can then send that IPA to users (they can install via Apple Configurator, iTunes, or third-party services like Diawi which enable an OTA download). Ad Hoc is less convenient than TestFlight because UDIDs must be collected and the 100 device limit is usually per account (includes those used in development). But it’s an option for distributing to a closed group (like a client demo to a few people) without App Store review. Keep in mind each device’s UDID must be in the profile or the app won’t run on it.

- **Apple Developer Enterprise Program (In-House):** The Enterprise Program is for companies distributing proprietary apps internally to their employees (outside of the App Store) ([Switching to the Apple Developer Program - Support](https://developer.apple.com/support/switching-to-the-apple-developer-program/#:~:text=The%20Apple%20Developer%20Enterprise%20Program,employees%20using%20secure%20internal%20systems)) ([How to distribute iOS app out of the store with iOS Enterprise Program](https://www.goodbarber.com/blog/how-to-distribute-ios-app-out-of-the-store-with-ios-enterprise-program-a871/#:~:text=Program%20www,and%20costs%20%24299%20per%20year)). It costs $299/year and is only available to eligible organizations (you have to apply and be accepted by Apple, generally requiring a D-U-N-S business number and proof of need). An enterprise developer can sign apps with an *Enterprise Distribution Certificate*, which allows the app to run on any iOS device (no per-device UDID registration). The company can then host the IPA on a website or use an MDM to distribute, and any user in the company can install it (they will have to trust the enterprise certificate in device settings). This is suitable for internal apps (e.g., a custom app used only by company staff). **Note:** Apps signed with an enterprise certificate are not meant for public distribution; Apple has strict rules and can revoke certificates if misused. For most developers not in a large company, this program is not applicable.

- **Unlisted App Distribution:** Recently, Apple introduced an option for unlisted app distribution. This allows you to distribute an app via the App Store, but not publicly discoverable – only people with the direct link can access it. You still go through App Review, but you can request Apple to make the app unlisted (often used for apps for a limited audience, like a conference or a specific group). This isn’t a separate distribution method you choose in Xcode; it’s a status you request from Apple after your app is approved. It’s useful when your app is not meant for the general public but App Store distribution (with a link) is preferred over Ad Hoc for ease of updates.

- **Custom Apps for Business or Education:** If you are developing an app for a specific business or school and they want to privately distribute it to their members via Apple’s managed programs, you can use the **Apple Business Manager** or **Apple School Manager** distribution. This is a bit out of scope, but essentially, you (as a developer) can publish the app as a **Custom App** to a specific organization’s App Store Connect account, and only that organization (via their Business Manager) can see and install the app.

In summary, for most use cases:
- Use **TestFlight** for beta testing.
- Use **App Store** for public distribution.
- Use **Ad Hoc** if you have a very specific small group that can’t go through TestFlight (though these days TestFlight covers most testing needs).
- Enterprise is only if you’re a company with internal apps not meant for the public or App Store at all.

## App Store Review Process and Tips for Approval

Apple’s App Review is known to be more stringent. Here’s what to expect and some tips:

- **Review Criteria:** Apple reviews apps against the [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/). They check for a wide range of things: compliance with content rules, no private API usage, app stability, UI/UX quality, and more. They also ensure your app doesn’t violate any Apple policies (for example, not bypassing in-app purchase rules if you offer digital goods, etc.). It’s a human review (with some automated assistance).

- **Common Rejection Reasons:** Some common issues new developers hit:
  - *Crashes and Bugs:* If the app crashes during review or has obvious bugs, Apple will reject it (Guideline 2.1). Test thoroughly – especially the first launch experience. Make sure any required configuration (like an account login) is either set up or you provide a demo account for review.
  - *Incomplete Metadata:* If you forget to provide a privacy policy for an app that needs one, or if your screenshots are clearly not representative (e.g., placeholders or unrelated images), they might reject until you fix those.
  - *Privacy Permissions:* If your app uses camera, microphone, location, etc., ensure you have the proper usage description strings in the Info.plist (NSCameraUsageDescription, etc.) and that the usage is justified. Apple will reject apps that ask for permissions with no apparent need or without proper explanation to the user.
  - *Guideline 4.0 - Design:* Apple can reject if the app’s user interface is extremely sub-par or not iOS-like. Using standard controls via Tauri should be fine since it’s essentially a web UI that you control. Just avoid having an app that feels like a website wrapper with no value – Apple can reject overly simple webview apps that don’t offer native functionality.
  - *Guideline 4.2 - Minimum Functionality:* Ensure your app is fully functional and provides value. If it’s an extremely simple app or a demo, Apple might question it. Given Krome is a web/Tauri app, make sure it doesn’t feel like a demo.
  - *Account Sign-In:* If your app requires login, Apple’s review team **must be able to fully use the app**. Provide them with a demo account (include credentials in the App Review notes field when submitting). If certain features are behind login or specific conditions, explain how to access them.
  - *Payments:* If your app sells digital content or subscriptions, you *must* use Apple’s In-App Purchase (with some exceptions for reader apps, etc.). This might not apply to Krome, but be aware: external payment links or instructions to pay externally are a big no-no.
  - *Use of Protected Content:* If your app includes copyrighted material, make sure you have rights or it falls under fair use. Also, avoid using Apple trademarks or images in your app listing inappropriately.

- **Communication:** If Apple rejects your app, they will give a reason code and sometimes a message or screenshot. Read it carefully. You can directly reply in the Resolution Center to ask for clarification or inform them of a fix. Apple’s reviewers often respond by the next day. You can resubmit a new build addressing the issues.

- **Review Time:** As mentioned, Apple says ~90% are reviewed in 24 hours ([Apple Publishes New Webpages Explaining the Benefits of the App Store and the Company's Developer Program - MacStories](https://www.macstories.net/news/apple-publishes-new-webpages-explaining-the-benefits-of-the-app-store-and-the-companys-developer-program/#:~:text=,outside%20a%20developer%E2%80%99s%20local%20region)), but give yourself buffer. During holidays (especially late December), reviews can slow down due to staff holidays. Also, if you get into an appeal scenario, it could take longer. Plan releases accordingly (don’t release last-minute if you have a hard deadline).

- **Tips for Smooth Approval:**
  - Provide **accurate metadata**. Ensure your app description isn’t misleading and matches the app’s content.
  - **Use TestFlight** for a trial run. Sometimes an issue that might cause rejection (like a crash on a fresh install) can be caught by having new users test your TestFlight build.
  - In the **Review notes**, mention anything unusual the reviewer should know (e.g., “Login with user:`test@example.com` password:`Test1234` to access the full app features”).
  - Make sure to **increment your build number** (CFBundleVersion) each submission. If you upload a build and then need to upload another, Xcode will require you to bump either version or build number. It’s good practice to increase the build number for each re-submission to avoid confusion.
  - Keep an eye on App Store Connect after submission – sometimes Apple asks for additional information via the Resolution Center without outright rejecting (e.g., they might ask for a video of how to navigate the app if they had trouble, or ask you to explain use of a certain API).
  - If you believe a rejection is not valid, you can **appeal** to the App Review Board. But use that as a last resort and be sure you’re in the right according to the guidelines.

Ultimately, if you follow guidelines and test well, you should get through App Review. Once approved, subsequent updates generally go smoother as long as you don’t introduce new issues.

## Common Pitfalls and Troubleshooting (iOS)

Even with preparation, iOS development can throw some curveballs. Here are issues you might face and solutions:

- **Code Signing Errors:** These are the bane of iOS developers. Errors like *“No provisioning profile with expected Team ID was found”* or *“Code signing ‘Krome.app’ failed”* can appear. To fix:
  - Open Xcode and check Signing settings. Ensure the correct team is selected and that a profile is shown as “Provisioning Profile: Automatic” (meaning Xcode found/created one).
  - If you have multiple Apple accounts or teams, make sure the correct one is used.
  - Delete any old/expired provisioning profiles from your system (in Xcode’s Preferences > Accounts > Manage Certificates or in `~/Library/MobileDevice/Provisioning Profiles`).
  - Sometimes choosing *“Product > Clean Build Folder”* and rebuilding helps after fixing signing issues.
  - If automatic signing fails, you can create a manual provisioning profile on the developer website and assign it, but auto is usually easier.

- **Bundle Identifier mismatch:** If you change the app’s identifier in `tauri.conf.json` after generating the Xcode project, you need to update it in Xcode as well (and possibly re-run `tauri ios init`). The bundle ID in the provisioning profile must match the app. Apple dev portal allows wildcard App IDs for development (e.g. `com.mycompany.*`), but for distribution an explicit match is needed.

- **Simulator vs Device Issues:** Sometimes a bug appears only on device or only on simulator. For instance, a Tauri app might work on simulator but crash on device due to a missing entitlement or resource. Check the device logs using Xcode’s Devices & Simulators window or Console app. A common one: accessing an HTTP server on your local network – iOS 14+ requires a privacy permission for local network access. Tauri’s dev server might trigger a prompt asking to allow local network; make sure to accept or configure NSLocalNetworkUsageDescription in Info.plist if needed ([Develop | Tauri](https://v2.tauri.app/develop/#:~:text=Note)) (only if your app specifically needs to find devices on the network).

- **CocoaPods not installed error:** If you see an error about CocoaPods when building, ensure you ran `brew install cocoapods` and then run `npx cap sync` or the Tauri equivalent if needed (Tauri should call `pod install` for you on init). You can also manually go to `src-tauri/gen/apple` and run `pod install` if things seem out of sync. CocoaPods will generate an Xcode workspace – make sure you open the .xcworkspace, not the .xcodeproj, if pods are used.

- **App Transport Security (ATS):** By default, iOS apps enforce HTTPS for network calls. If Krome (or its web content) tries to call an HTTP endpoint, it might get blocked by ATS unless configured otherwise. You can add exceptions in Info.plist for any URLs or allow arbitrary loads during development. It’s best to serve content over HTTPS in production. Check for any network errors in console if something isn’t loading.

- **Large App Size:** Tauri apps include a WebKit WebView, which can make app size a bit larger. Make sure to build in Release mode for actual sizing. If size is a concern, ensure you don’t include unnecessary assets. (Apple has no hard limit on app size except over cellular download limit ~200 MB, but smaller is always better for user experience.)

- **TestFlight-specific:** If your TestFlight external build is stuck in “Waiting for Review” for too long, double-check if you missed an email from Apple. Beta review might have rejected it quietly and you need to submit a new build. Alternatively, sometimes re-inviting testers or refreshing the build listing can nudge it. Usually though, beta reviews are quick (a few hours to a day).

- **Device-specific bugs:** Always test on at least one real iPhone if you can. The simulator is great but doesn’t perfectly emulate everything (e.g., certain sensor APIs, camera, push notifications, etc., don’t function fully in simulator). If you can, test on a modern device and an older device to catch performance issues. If you don’t have physical devices, TestFlight feedback from diverse users/devices is invaluable.

- **Memory and Performance:** iOS may kill your app if it uses too much memory. A WebView app might use memory for web content; be sure to test with heavier use cases. Use Xcode’s Memory Debugger or Instruments to check for leaks or excessive usage. Optimize images and assets for mobile.

- **Crash Logs:** If your app crashes on a user’s device (or during review), retrieving the crash log can help pinpoint the issue. Xcode’s Organizer (Crashes section) may show crashes from TestFlight or App Store usage, symbolicated if you uploaded dSYM symbols. Symbolicate any crash logs to see the Rust or JS stack trace if possible.

## CI/CD Setup for iOS (If Applicable)

Automating iOS builds and deployment can save a lot of time, but it’s slightly more complex due to code signing. Here are some considerations:

- **CI Environment:** Use a macOS CI runner for iOS builds (for example, GitHub Actions offers macOS runners, as do Azure DevOps, CircleCI, Bitrise, etc.). Set up the environment by installing Xcode (on GitHub Actions, a recent Xcode is pre-installed on the macOS runner). You’ll also need to install CocoaPods (`brew install cocoapods`) and run `pod install` in the project as part of the build steps.

- **Automating the Build:** You can script `cargo tauri ios build -- --export-method app-store-connect` to produce the IPA in CI. However, to sign the app on CI, you need your distribution certificate and provisioning profile. There are two main approaches:
  1. **Using App Store Connect API Key (Xcode 13+ Cloud signing):** Apple allows API key-based authentication to sign and upload, as shown by Tauri using `altool` with `--apiKey` and `--apiIssuer` ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=Now%20you%20can%20use%20the,app%20to%20the%20App%20Store)). You’d create an API key in App Store Connect (Users and Access > Keys) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=Authentication)) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=The%20iOS%20and%20macOS%20apps,Connect%20API%20key%20to%20authenticate)) and add the .p8 key file to your CI secrets. Then you can use `xcodebuild` or `altool` to upload without manually managing certs. For example, `xcodebuild -exportArchive -archivePath Krome.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath .` can export an IPA, and then use `xcrun altool --upload-app -f Krome.ipa --apiKey XYZ --apiIssuer ABC` to upload it. This approach leverages Apple’s notarization of your identity via API key.
  2. **Classic Code Signing:** Upload your Distribution certificate (.p12 file) and the provisioning profile (.mobileprovision) as encrypted CI secrets. In the CI job, install the certificate into the keychain (using `security import` command) and install the provisioning profile (copy to `~/Library/MobileDevice/Provisioning Profiles`). Then run the Xcode build. This is a bit involved but many CI services have guides or even built-in steps for this. Fastlane can simplify this process with its `match` tool, which manages provisioning profiles and certificates.

- **Fastlane:** Fastlane is a popular tool to automate iOS (and Android) deployments. For iOS, Fastlane can handle certificates (`match`), build the app (`gym`), and upload to TestFlight or App Store (`pilot` or `deliver`). If you plan to do frequent releases, investing time in a Fastlane setup can pay off. Fastlane can be integrated into GitHub Actions or any CI easily (it’s just running the `fastlane` CLI).

- **TestFlight in CI:** You can configure CI to automatically push every successful build to TestFlight for internal testers. This is great for continuous testing (each commit on main branch, for instance). Just be cautious to not spam external testers with too many builds unless needed. Use distribution groups accordingly.

- **App Store Release Automation:** You might choose to automate App Store releases for certain tags or version bumps. With CI, you can upload the build and even submit for review automatically using App Store Connect API. However, many teams prefer manual control at the final release step (you might automate building and uploading as a draft, but hit “Release” manually after review). It’s up to your workflow comfort.

- **Continuous Monitoring:** After deploying via CI, monitor the outcome. Did the build get to TestFlight? If uploading to App Store Connect, did the binary pass notarization and processing? These logs can be seen in CI or in App Store Connect (Activity section).

Remember to secure your secrets (API keys, certs) in the CI system. Never put them in plain text in the repository.

---

Deploying a Tauri 2.0 app like Krome to mobile is definitely an advanced task, but with the above steps, you can set up a robust workflow for both Android and iOS. We covered environment setup (Rust, Android Studio, Xcode, etc.), building and packaging the app for each platform, navigating the Google Play and Apple App Store processes, alternative distribution mechanisms for testing or enterprise needs, the review processes and how to handle them, common issues you might face, and how to utilize CI/CD to streamline your releases. 

By following these guides, a web developer with little mobile experience should be able to get up to speed and successfully deploy their Tauri-built app on both major mobile platforms. Good luck with your mobile deployment! ([Google Play | Tauri](https://v2.tauri.app/distribute/google-play/#:~:text=You%20can%20build%20an%20Android,by%20running%20the%20following%20command)) ([App Store | Tauri](https://v2.tauri.app/distribute/app-store/#:~:text=To%20build%20your%20iOS%20app%2C,command))

