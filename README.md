# ARMSVault - A mobile, native 2ACoin ARMS wallet

![Screenshot](https://i.imgur.com/zJrbZIC.png)
![Screenshot](https://i.imgur.com/i6J1uKH.png)

## Releases - Android

The initial release of 2ACoin ARMSVault is built for the Android mobile platform. We have plans for an IOS release at a later time. Check the [2ACoin ARMSVault Releases page](https://github.com/2acoin/2acoin-mobile-wallet/releases) for the latest release.

### Initial Setup

* cd TonChan
* yarn install

### Running

`git clone https://github.com/2acoin/2acoin-mobile-wallet.git`

`cd 2acoin-mobile-wallet`

* Install React Native CLI

`npm install -g react-native-cli`

* Install yarn if you don't have it already:

`npm install -g yarn`

* Install the dependencies:

`yarn install`

* Next, we need to setup the Android JDK and development environment.

First we need to install the Android JDK (Version 8!).

* Ubuntu - `sudo apt-get install default-jdk`
* Arch Linux - `pacman -S jdk-openjdk`
* OSX - `brew tap AdoptOpenJDK/openjdk` & `brew cask install adoptopenjdk8`

Next, lets install Android Studio.

* Ubuntu - `https://askubuntu.com/a/941222/764667`
* Arch Linux - `pacaur -S android-studio` (It's in the AUR, feel free to use your favourite package manager or install manually.)

Next, we need to run the android studio setup, and set some path variables. This is a bit complicated, so I'm going to hand off to the facebook guide here: https://facebook.github.io/react-native/docs/getting-started#1-install-android-studio

Skip the 'Creating a new application' header, and continue on to 'Preparing the Android Device'. Run `android-studio .` in this directory to import the project.

Once you have your virtual device setup, you can launch the app itself.

* Run the program:

`yarn start` (or `yarn start-release`)

If you get an error about 'Unsupported major.minor version', you may need to set JAVA_HOME to point to the correct jdk.

For example, `export JAVA_HOME=/usr/lib/jvm/java-8-openjdk/jre/`

If you get an error about duplicate resources, run `rm -r android/app/src/main/res/drawable-*`

## Developing

### Logging

You probably want to run `react-native log-android` so you can read the console output, and have an easier log of what's going on as you're developing. Errors will get printed to the device, but console.log won't, and it's a little hard to read.


### Live Reloading

You probably also want to enable live reloading. Hit "Ctrl-M" in your emulator, or type `adb shell input keyevent 82` to open the developer menu, and enable `Live Reload`. You probably don't want to use Hot Reloading, it's pretty buggy.

### Native Code

If you need to update the native code, you may find this article helpful: https://thebhwgroup.com/blog/react-native-jni

To get the updated class signatures, rebuild the Java code (i.e., run `react-native run-android`, then run 

```
javap -classpath android/app/build/intermediates/classes/debug/ -s com.armsvault.ClassName
```

Where `ClassName` is the class you want to query. For example, to get the signatures for `WalletBlockInfo`:

```
javap -classpath android/app/build/intermediates/classes/debug/ -s com.armsvault.WalletBlockInfo
```

Then the constructor signature is this section:

```
public com.armsvault.WalletBlockInfo(com.armsvault.RawTransaction, com.armsvault.RawTransaction[]);
    Signature: (Lcom/armsvault/RawTransaction;[Lcom/armsvault/RawTransaction;)V
```

Specifically, `(Lcom/armsvault/RawTransaction;[Lcom/armsvaylt/RawTransaction;)V`

### Flowcharts

There is a flow chart describing screen navigation in the `flowcharts` folder.

There is also an xml file that you can import into [draw.io](https://draw.io) if you want to modify the flowchart.

* node --max-old-space-size=8192 node_modules/react-native/local-cli/cli.js start
* react-native run-android

### Logging

`react-native log-android`

### Creating a release

You need to bump the version number in:

* `src/Config.js` - `appVersion`
* `android/app/build.gradle` - `versionCode` and `versionName`
* `package.json` - `version` - Not strictly required

Then
`cd android`
`./gradlew bundleRelease`
Optionally
`./gradlew installRelease`

### Integrating QR Codes or URIs

ArmsVault supports two kinds of QR codes.

* Standard addresses / integrated addresses - This is simply the address encoded as a QR code.

* 2acoin:// URI encoded as a QR code.

Your uri must being with `2acoin://` followed by the address to send to, for example, `2acoin://gunsHpae2kTGe64sLSDwcYNzkBS9gcarqVuoSsmXWSrxFsjsphE9UXCDnRaJ4cFn73LaL4wMQrvNeKNYWTvbucqR8wwsuK6fRU`

There are a few optional parameters.

* `name` - This is used to add you to the users address book, and identify you on the 'Confirm' screen. A name can contain spaces, and should be URI encoded.
* `amount` - This is the amount to send you. This should be specified in atomic units.
* `paymentid` - If not using integrated address, you can specify a payment ID. Specifying an integrated address and a payment ID is illegal.

An example of a URI containing all of the above parameters:

```
2acoin://gunsHpae2kTGe64sLSDwcYNzkBS9gcarqVuoSsmXWSrxFsjsphE9UXCDnRaJ4cFn73LaL4wMQrvNeKNYWTvbucqR8wwsuK6fRU?amount=200000000&name=Starbucks%20Coffee&paymentid=f13adc8ac78eb22ffcee3f82e0e9ffb251dc7dc0600ef599087a89b623ca1402
```

This would send `2 ARMS` (200000000 in atomic units) to the address `gunsHpae2kTGe64sLSDwcYNzkBS9gcarqVuoSsmXWSrxFsjsphE9UXCDnRaJ4cFn73LaL4wMQrvNeKNYWTvbucqR8wwsuK6fRU`, using the name `Starbucks Coffee` (Note the URI encoding), and using a payment ID of `f13adc8ac78eb22ffcee3f82e0e9ffb251dc7dc0600ef599087a89b623ca1402`

You can also just display the URI as a hyperlink. If a user clicks the link, it will open the app, and jump to the confirm screen, just as a QR code would function. (Provided all the fields are given)
<<<<<<< HEAD

## Running natively on your Android device

Follow [this](https://facebook.github.io/react-native/docs/running-on-device.html) guide.

## Building an APK

Follow [this](https://facebook.github.io/react-native/docs/signed-apk-android.html) guide.

Once you have finished, compile the APK:

`yarn build-android`

Install the APK on your device:

`yarn deploy-android`

If it all works, you can then upload to the play store.

Note that you need to close the emulator to get the `yarn deploy-android` to install on your mobile.

## Forking

Start by cloning the latest tagged release. If it's not in a release, it has not been fully tested, and may have bugs.

#### Modifying icon

Replace `assets/img/icon.png` with your icon image. Make sure it is 1024x1024.

Run `npm install -g yo generator-rn-toolbox` (You may need to run this with sudo)

Run `yo rn-toolbox:assets --icon assets/img/icon.png --force`

When it asks for the name of your react-native project, enter `TonChan`

#### Renaming app

There is a tool that does this, `react-native-rename`. However, the native code, (`android/app/src/main/jni/TurtleCoin.cpp`) needs the name of the class to find the Java/C++ interface.

If you use this tool, you will probably need to update that code.

Run `npm install -g react-native-rename` (You may need to run this with sudo)

Run `react-native-rename your-new-project-name` from this directory. (Obviously, replace with the desired name)

This might confuse the build system. You probably should do this before installing.

#### Building an APK

You will need to set up your signing key, and keystore file. See https://facebook.github.io/react-native/docs/signed-apk-android.html#generating-a-signing-key

#### Config

Edit `src/Config.js`. The fields should be self explanatory. Make sure to recompile.

#### Sentry

Sentry is a tool to report crashes in the application. *Please* configure this, or disable it, so we do not get reported errors for your application.

Remove the two files `android/sentry.properties` and `ios/sentry.properties`, and then run `react-native link`. 

This will run the sentry setup wizard, to setup error reporting for your app.

Then, copy the line of code `Sentry.config('https://8ecf138e1d1e4d558178be3f2b5e1925@sentry.io/1411753').install();` that is shown on the configuration page, and replace with our line in `src/Sentry.js`.

Your API key will be different, don't just copy the one here.

Finally, replace `Config.coinName === '2ACoin'` in `src/Sentry.js` with the coin name defined in the config.

Once you've done that, you can test sentry is working by adding something like `throw new Error('Hello, sentry');` in the mainscreen constructor.
