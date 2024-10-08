import * as chains from 'viem/chains'

export type KnownChainsType = typeof knownChains

// TODO this is just lazily copying this twice we could do this cleaner
const knownChains = {
	[chains.mainnet.id]: chains.mainnet,
	[chains.optimism.id]: chains.optimism,
	[chains.optimismSepolia.id]: chains.optimismSepolia,
	[chains.arbitrum.id]: chains.arbitrum,
	[chains.base.id]: chains.base,
	[chains.baseSepolia.id]: chains.baseSepolia,
	[chains.polygon.id]: chains.polygon,
	[chains.zora.id]: chains.zora,
	[chains.sepolia.id]: chains.sepolia,
	[chains.fuseSparknet.id]: chains.fuseSparknet,
	[chains.funkiMainnet.id]: chains.funkiMainnet,
	[chains.funkiSepolia.id]: chains.funkiSepolia,
	[chains.flareTestnet.id]: chains.flareTestnet,
	[chains.evmosTestnet.id]: chains.evmosTestnet,
	[chains.defichainEvm.id]: chains.defichainEvm,
	[chains.cyberTestnet.id]: chains.cyberTestnet,
	[chains.blastSepolia.id]: chains.blastSepolia,
	[chains.areonNetwork.id]: chains.areonNetwork,
	[chains.arbitrumNova.id]: chains.arbitrumNova,
	[chains.zoraTestnet.id]: chains.zoraTestnet,
	[chains.zoraSepolia.id]: chains.zoraSepolia,
	[chains.yooldoVerse.id]: chains.yooldoVerse,
	[chains.taikoJolnir.id]: chains.taikoJolnir,
	[chains.skaleNebula.id]: chains.skaleNebula,
	[chains.skaleExorde.id]: chains.skaleExorde,
	[chains.skaleEuropa.id]: chains.skaleEuropa,
	[chains.rss3Sepolia.id]: chains.rss3Sepolia,
	[chains.rootPorcini.id]: chains.rootPorcini,
	[chains.reyaNetwork.id]: chains.reyaNetwork,
	[chains.polygonAmoy.id]: chains.polygonAmoy,
	[chains.palmTestnet.id]: chains.palmTestnet,
	[chains.neonMainnet.id]: chains.neonMainnet,
	[chains.moonbeamDev.id]: chains.moonbeamDev,
	[chains.modeTestnet.id]: chains.modeTestnet,
	[chains.metisGoerli.id]: chains.metisGoerli,
	[chains.liskSepolia.id]: chains.liskSepolia,
	[chains.lineaGoerli.id]: chains.lineaGoerli,
	[chains.kavaTestnet.id]: chains.kavaTestnet,
	[chains.haqqMainnet.id]: chains.haqqMainnet,
	[chains.flowTestnet.id]: chains.flowTestnet,
	[chains.flowMainnet.id]: chains.flowMainnet,
	[chains.ektaTestnet.id]: chains.ektaTestnet,
	[chains.bobaSepolia.id]: chains.bobaSepolia,
	[chains.bevmMainnet.id]: chains.bevmMainnet,
	[chains.beamTestnet.id]: chains.beamTestnet,
	[chains.astarZkyoto.id]: chains.astarZkyoto,
	[chains.apexTestnet.id]: chains.apexTestnet,
	[chains.zkLinkNovaSepoliaTestnet.id]: chains.zkLinkNovaSepoliaTestnet,
	[chains.xdcTestnet.id]: chains.xdcTestnet,
	[chains.xaiTestnet.id]: chains.xaiTestnet,
	[chains.taikoKatla.id]: chains.taikoKatla,
	[chains.taikoHekla.id]: chains.taikoHekla,
	[chains.skaleTitan.id]: chains.skaleTitan,
	[chains.skaleRazor.id]: chains.skaleRazor,
	[chains.seiTestnet.id]: chains.seiTestnet,
	[chains.pulsechain.id]: chains.pulsechain,
	[chains.pgnTestnet.id]: chains.pgnTestnet,
	[chains.otimDevnet.id]: chains.otimDevnet,
	[chains.neonDevnet.id]: chains.neonDevnet,
	[chains.mevTestnet.id]: chains.mevTestnet,
	[chains.l3xTestnet.id]: chains.l3xTestnet,
	[chains.jbcTestnet.id]: chains.jbcTestnet,
	[chains.harmonyOne.id]: chains.harmonyOne,
	[chains.eosTestnet.id]: chains.eosTestnet,
	[chains.bxnTestnet.id]: chains.bxnTestnet,
	[chains.btrTestnet.id]: chains.btrTestnet,
	[chains.bscTestnet.id]: chains.bscTestnet,
	[chains.bitTorrent.id]: chains.bitTorrent,
	[chains.baseGoerli.id]: chains.baseGoerli,
	[chains.astarZkEVM.id]: chains.astarZkEVM,
	[chains.zetachain.id]: chains.zetachain,
	[chains.xrSepolia.id]: chains.xrSepolia,
	[chains.x1Testnet.id]: chains.x1Testnet,
	[chains.thaiChain.id]: chains.thaiChain,
	[chains.shibarium.id]: chains.shibarium,
	[chains.seiDevnet.id]: chains.seiDevnet,
	[chains.satoshiVM.id]: chains.satoshiVM,
	[chains.rootstock.id]: chains.rootstock,
	[chains.moonriver.id]: chains.moonriver,
	[chains.metachain.id]: chains.metachain,
	[chains.localhost.id]: chains.localhost,
	[chains.etherlink.id]: chains.etherlink,
	[chains.dogechain.id]: chains.dogechain,
	[chains.crossbell.id]: chains.crossbell,
	[chains.avalanche.id]: chains.avalanche,
	[chains.zhejiang.id]: chains.zhejiang,
	[chains.wanchain.id]: chains.wanchain,
	[chains.songbird.id]: chains.songbird,
	[chains.sapphire.id]: chains.sapphire,
	[chains.redstone.id]: chains.redstone,
	[chains.qTestnet.id]: chains.qTestnet,
	[chains.qMainnet.id]: chains.qMainnet,
	[chains.nautilus.id]: chains.nautilus,
	[chains.filecoin.id]: chains.filecoin,
	[chains.edgeware.id]: chains.edgeware,
	[chains.edgeless.id]: chains.edgeless,
	[chains.darwinia.id]: chains.darwinia,
	[chains.ancient8.id]: chains.ancient8,
	[chains.zilliqa.id]: chains.zilliqa,
	[chains.vechain.id]: chains.vechain,
	[chains.syscoin.id]: chains.syscoin,
	[chains.stratis.id]: chains.stratis,
	[chains.shimmer.id]: chains.shimmer,
	[chains.phoenix.id]: chains.phoenix,
	[chains.nexilix.id]: chains.nexilix,
	[chains.metalL2.id]: chains.metalL2,
	[chains.mandala.id]: chains.mandala,
	[chains.holesky.id]: chains.holesky,
	[chains.hardhat.id]: chains.hardhat,
	[chains.fraxtal.id]: chains.fraxtal,
	[chains.coreDao.id]: chains.coreDao,
	[chains.classic.id]: chains.classic,
	[chains.bahamut.id]: chains.bahamut,
	[chains.auroria.id]: chains.auroria,
	[chains.zkSync.id]: chains.zkSync,
	[chains.zkFair.id]: chains.zkFair,
	[chains.xLayer.id]: chains.xLayer,
	[chains.unreal.id]: chains.unreal,
	[chains.taraxa.id]: chains.taraxa,
	[chains.scroll.id]: chains.scroll,
	[chains.rollux.id]: chains.rollux,
	[chains.plinga.id]: chains.plinga,
	[chains.merlin.id]: chains.merlin,
	[chains.mantle.id]: chains.mantle,
	[chains.klaytn.id]: chains.klaytn,
	[chains.karura.id]: chains.karura,
	[chains.hedera.id]: chains.hedera,
	[chains.goerli.id]: chains.goerli,
	[chains.gnosis.id]: chains.gnosis,
	[chains.fantom.id]: chains.fantom,
	[chains.dchain.id]: chains.dchain,
	[chains.cronos.id]: chains.cronos,
	[chains.chiliz.id]: chains.chiliz,
	[chains.bronos.id]: chains.bronos,
	[chains.bitkub.id]: chains.bitkub,
	[chains.aurora.id]: chains.aurora,
	[chains.wemix.id]: chains.wemix,
	[chains.tenet.id]: chains.tenet,
	[chains.taiko.id]: chains.taiko,
	[chains.spicy.id]: chains.spicy,
	[chains.ronin.id]: chains.ronin,
	[chains.opBNB.id]: chains.opBNB,
	[chains.oasys.id]: chains.oasys,
	[chains.metis.id]: chains.metis,
	[chains.meter.id]: chains.meter,
	[chains.manta.id]: chains.manta,
	[chains.lycan.id]: chains.lycan,
	[chains.lukso.id]: chains.lukso,
	[chains.linea.id]: chains.linea,
	[chains.kroma.id]: chains.kroma,
	[chains.iotex.id]: chains.iotex,
	[chains.inEVM.id]: chains.inEVM,
	[chains.flare.id]: chains.flare,
	[chains.evmos.id]: chains.evmos,
	[chains.degen.id]: chains.degen,
	[chains.cyber.id]: chains.cyber,
	[chains.canto.id]: chains.canto,
	[chains.blast.id]: chains.blast,
	[chains.astar.id]: chains.astar,
	[chains.acala.id]: chains.acala,
	[chains.rss3.id]: chains.rss3,
	[chains.root.id]: chains.root,
	[chains.real.id]: chains.real,
	[chains.palm.id]: chains.palm,
	[chains.nexi.id]: chains.nexi,
	[chains.mode.id]: chains.mode,
	[chains.lyra.id]: chains.lyra,
	[chains.lisk.id]: chains.lisk,
	[chains.kava.id]: chains.kava,
	[chains.gobi.id]: chains.gobi,
	[chains.fuse.id]: chains.fuse,
	[chains.fibo.id]: chains.fibo,
	[chains.ekta.id]: chains.ekta,
	[chains.crab.id]: chains.crab,
	[chains.celo.id]: chains.celo,
	[chains.boba.id]: chains.boba,
	[chains.beam.id]: chains.beam,
	[chains.xdc.id]: chains.xdc,
	[chains.xai.id]: chains.xai,
	[chains.sei.id]: chains.sei,
	[chains.pgn.id]: chains.pgn,
	[chains.okc.id]: chains.okc,
	[chains.mev.id]: chains.mev,
	[chains.l3x.id]: chains.l3x,
	[chains.koi.id]: chains.koi,
	[chains.kcc.id]: chains.kcc,
	[chains.jbc.id]: chains.jbc,
	[chains.bsc.id]: chains.bsc,
	[chains.ham.id]: chains.ham,
	[chains.eos.id]: chains.eos,
	[chains.eon.id]: chains.eon,
	[chains.dfk.id]: chains.dfk,
	[chains.bxn.id]: chains.bxn,
	[chains.btr.id]: chains.btr,
	[chains.bob.id]: chains.bob,
}
