// Copyright (C) 2018, Zpalmtree
// Copyright (C) 2019, 2ACoin Developers
//
// Please see the included LICENSE file for more information.

import { Platform } from 'react-native';

import { MixinLimit, MixinLimits, Daemon } from 'turtlecoin-wallet-backend';

import {
    derivePublicKey, generateKeyDerivation, generateRingSignatures,
    deriveSecretKey, generateKeyImage, checkRingSignature,
} from './NativeCode';

const Config = new function() {
    /**
     * If you can't figure this one out, I don't have high hopes
     */
    this.coinName = '2ACoin';

    /**
     * Prefix for URI encoded addresses
     */
    this.uriPrefix = '2acoin://';

    /**
     * How often to save the wallet, in milliseconds
     */
    this.walletSaveFrequency = 60 * 1000;

    /**
     * The amount of decimal places your coin has, e.g. 2ACoin has eight
     * decimals
     */
    this.decimalPlaces = 8;

    /**
     * The address prefix your coin uses - you can find this in CryptoNoteConfig.h.
     * In 2ACoin, this converts to guns
     */
    this.addressPrefix = 0x1fcdee;

    /**
     * Request timeout for daemon operations in milliseconds
     */
    this.requestTimeout = 10 * 1000;

    /**
     * The block time of your coin, in seconds
     */
    this.blockTargetTime = 90;

    /**
     * How often to process blocks, in millseconds
     */
    this.syncThreadInterval = 10;

    /**
     * How often to update the daemon info, in milliseconds
     */
    this.daemonUpdateInterval = 10 * 1000;

    /**
     * How often to check on locked transactions
     */
    this.lockedTransactionsCheckInterval = 30 * 1000;

    /**
     * The amount of blocks to process per 'tick' of the mainloop. Note: too
     * high a value will cause the event loop to be blocked, and your interaction
     * to be laggy.
     */
    this.blocksPerTick = 1;

    /**
     * Your coins 'ticker', generally used to refer to the coin, i.e. 123 TRTL
     */
    this.ticker = 'ARMS';

    /**
     * Most people haven't mined any blocks, so lets not waste time scanning
     * them
     */
    this.scanCoinbaseTransactions = false;

    /**
     * The minimum fee allowed for transactions, in ATOMIC units
     */
    this.minimumFee = 50000;

    /* Fee per byte is rounded up in chunks. This helps makes estimates
     * more accurate. It's suggested to make this a power of two, to relate
     * to the underlying storage cost / page sizes for storing a transaction. */
    this.feePerByteChunkSize = 256;

    /* Fee to charge per byte of transaction. Will be applied in chunks, see
     * above. This value comes out to 1000 ATOMIC UNITS. We use this value
     * instead because it makes for pretty resulting fees.
     * You can read this as.. the fee per chunk is .00001000 
     * The fee per byte is 256000 / 256 (chunk size).          */
    this.minimumFeePerByte = 256000 / this.feePerByteChunkSize;

    /**
     * Mapping of height to mixin maximum and mixin minimum
     */
    this.mixinLimits = new MixinLimits([
        /* Height: 0, minMixin: 0, maxMixin: 100, defaultMixin: 3 - V1 */
        new MixinLimit(0, 0, 100, 100),

        /* Height: 250, minMixin: 0, maxMixin: 7, defaultMixin: 7 - V2*/
        new MixinLimit(250, 0, 7, 7),

        /* Height: 100,000, minMixin: 0, maxMixin: 3, defaultMixin: 3 */
        new MixinLimit(100000, 0, 3, 3),
    ], 3 /* Default mixin of 3 before block 250 */),

    /**
     * The length of a standard address for your coin
     */
    this.standardAddressLength = 98;

    /**
     * The length of an integrated address for your coin - It's the same as
     * a normal address, but there is a paymentID included in there - since
     * payment ID's are 64 chars, and base58 encoding is done by encoding
     * chunks of 8 chars at once into blocks of 11 chars, we can calculate
     * this automatically
     */
    this.integratedAddressLength = 98 + ((64 * 11) / 8);

    /**
     * Use our native func instead of JS slowness
     */
    this.derivePublicKey = Platform.OS === 'ios' ? undefined : derivePublicKey;

    /**
     * Use our native func instead of JS slowness
     */
    this.generateKeyDerivation = Platform.OS === 'ios' ? undefined : generateKeyDerivation;

    /**
     * Use our native func instead of JS slowness
     */
    this.generateRingSignatures = Platform.OS === 'ios' ? undefined : generateRingSignatures;

    /**
     * Use our native func instead of JS slowness
     */
    this.deriveSecretKey = Platform.OS === 'ios' ? undefined : deriveSecretKey;

    /**
     * Use our native func instead of JS slowness
     */
    this.generateKeyImage = Platform.OS === 'ios' ? undefined : generateKeyImage;

    /**
     * Use our native func instead of JS slowness
     */
    this.checkRingSignatures = Platform.OS === 'ios' ? undefined: checkRingSignature;

    /**
     * Memory to use for storing downloaded blocks - 50MB
     */
    this.blockStoreMemoryLimit = 1024 * 1024 * 50;

    /**
     * Amount of blocks to request from the daemon at once
     */
    this.blocksPerDaemonRequest = 100;

    /**
     * The amount of seconds to permit not having fetched a block from the
     * daemon before emitting 'deadnode'. Note that this just means contacting
     * the daemon for data - if you are synced and it returns TopBlock - the
     * event will not be emitted.
     */
    this.maxLastFetchedBlockInterval = 60 * 3;
	
    /**
     * The amount of seconds to permit not having fetched a new network height
     * from the daemon before emitting 'deadnode'.
     */
    this.maxLastUpdatedNetworkHeightInterval = 60 * 3;

    /**
     * The amount of seconds to permit not having fetched a new local height
     * from the daemon before emitting 'deadnode'.
     */
    this.maxLastUpdatedLocalHeightInterval = 60 * 3;

    /**
     * Unix timestamp of the time your chain was launched.
     *
     * Note - you may want to manually adjust this. Take the current timestamp,
     * take away the launch timestamp, divide by block time, and that value
     * should be equal to your current block count. If it's significantly different,
     * you can offset your timestamp to fix the discrepancy
     */
    this.chainLaunchTimestamp = new Date(1000 * 1533143395);

    /**
     * Fee to take on all transactions, in percentage
     */
    this.devFeePercentage = 0.1;

    /**
     * Address to send dev fee to
     */
    this.devFeeAddress = 'gunsAuLW8PiYvmo7Xpumv1gtxFer3oVF85y1gSFFrrNiBgwRwfAnxKCetKshW3kcMShrNvMs33qCpEqziaRjxG1Q7HBeWN9pbq';

    /**
     * Base url for price API
     *
     * The program *should* fail gracefully if your coin is not supported, or
     * you just set this to an empty string. If you have another API you want
     * it to support, you're going to have to modify the code in Currency.js.
     */
    this.priceApiLink = 'https://api.coingecko.com/api/v3/simple/price';

    /**
     * Default daemon to use. Can either be a BlockchainCacheApi(baseURL, SSL),
     * or a ConventionalDaemon(url, port).
     */
    this.defaultDaemon = new Daemon('blockapi.2acoin.org', 443);

    /**
     * A link to where a bug can be reported for your wallet. Please update
     * this if you are forking, so we don't get reported bugs for your wallet...
     *
     */
    this.repoLink = 'https://github.com/2acoin/2acoin-mobile-wallet/issues';

    /**
     * This only controls the name in the settings screen.
     */
    this.appName = 'ARMSVault';

    /**
     * Slogan phrase during wallet CreateScreen
     */
    this.sloganCreateScreen = 'Start Amassing ARMS today!';

    /**
     * Displayed in the settings screen
     */
    this.appVersion = 'v0.1.1.5';

    /**
     * Base URL for us to chuck a hash on the end, and find a transaction
     */
    this.explorerBaseURL = 'https://explorer.2acoin.org/?hash=';

    /**
     * A link to your app on the Apple app store. Currently blank because we
     * haven't released for iOS yet...
     */
    this.appStoreLink = 'https://github.com/2acoin/2acoin-mobile-wallet/releases';

    /**
     * A link to your app on the google play store
     */
    this.googlePlayLink = 'https://play.google.com/store/apps/details?id=com.armsvault';

    /**
     * A url to fetch node info from. Should follow the turtlepay format
     * detailed here: https://docs.turtlepay.io/blockapi/
     */
    this.nodeListURL = 'https://blockapi.2acoin.org/node/list';
};

module.exports = Config;
