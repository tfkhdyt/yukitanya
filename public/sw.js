if (!self.define) {
	let i,
		e = {};
	const a = (a, n) => (
		(a = new URL(a + '.js', n).href),
		e[a] ||
			new Promise((e) => {
				if ('document' in self) {
					const i = document.createElement('script');
					(i.src = a), (i.onload = e), document.head.appendChild(i);
				} else (i = a), importScripts(a), e();
			}).then(() => {
				let i = e[a];
				if (!i) throw new Error(`Module ${a} didn’t register its module`);
				return i;
			})
	);
	self.define = (n, s) => {
		const t =
			i ||
			('document' in self ? document.currentScript.src : '') ||
			location.href;
		if (e[t]) return;
		let r = {};
		const c = (i) => a(i, t),
			o = { module: { uri: t }, exports: r, require: c };
		e[t] = Promise.all(n.map((i) => o[i] || c(i))).then((i) => (s(...i), r));
	};
}
define(['./workbox-2e6be583'], function (i) {
	'use strict';
	importScripts(),
		self.skipWaiting(),
		i.clientsClaim(),
		i.precacheAndRoute(
			[
				{
					url: '/PRIVACY_POLICY.md',
					revision: '4fa47d472a63ad9104aa26700ee25702',
				},
				{
					url: '/TERMS_OF_SERVICE.md',
					revision: 'a777452deaf015f8acbb4630dcea904b',
				},
				{
					url: '/_next/app-build-manifest.json',
					revision: 'b6d79513f2d6391e0ac50010b56d215b',
				},
				{
					url: '/_next/static/NGnGK5z8i338qBz6btJlz/_buildManifest.js',
					revision: '46272ef237d3a77de7f8de6f6388cf47',
				},
				{
					url: '/_next/static/NGnGK5z8i338qBz6btJlz/_ssgManifest.js',
					revision: 'b6652df95db52feb4daf4eca35380933',
				},
				{
					url: '/_next/static/chunks/188-34444c280fbabab9.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/227-9ebf65e9e75dbd24.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/345-04293642235ab716.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/408-e43c8d3734f64405.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/537-bf04a574d2ea8265.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/572-257da424f84c6203.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/628-98ae89da15a0540c.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/701-d77742735af72dcb.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/712-a14dfda6df0ddc85.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/74-655de39b7c5fbb7d.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/757-d8937dc54fbc6076.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/785-89fd5cef087b6074.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/813-ca36deb72a7b6316.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/815-eaca770f7130b0f5.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/867-e377685f3c0467a6.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/897-f63ebc9fb8e698c1.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/959-d7b89702190af605.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/963-801661bdc4e0643f.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/98-35ace338ea1877ba.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/988-660cc384fd46ef65.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/997-76f36c594cd7790a.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/9bb1fbd7-3855dcca05a29d63.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/favorite/page-ff89bb8237972ec9.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/home/page-71f37579a9c5b7fe.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/layout-a232376224ec0682.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/notifications/page-3c9c18c44f2979cb.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/premium/page-570c12d4dcac9f82.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/questions/%5Bslug%5D/page-bbfaa3e43a18b6e8.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/search/page-3b4e317bab9bfdda.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/subjects/%5Bid%5D/page-ac0ae9c9269d7975.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/subjects/page-5ed351d4ebedf962.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(dashboard)/users/%5Busername%5D/page-20215fc808ffb8bf.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/(landing-page)/page-b3f023cd7349bd79.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/_not-found-5e9ac1c3ecc9ccde.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/auth/sign-in/page-b4a1b11b359eb747.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/auth/sign-up/page-f407d151ae42e166.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/app/layout-e124312b6c04dcc6.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/framework-510ec8ffd65e1d01.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/main-89850af583008508.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/main-app-856d4b2086dc598f.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/pages/_app-09895359f0e9e1a4.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/pages/_error-09d3cf05bb4e3326.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js',
					revision: '837c0df77fd5009c9e46d446188ecfd0',
				},
				{
					url: '/_next/static/chunks/webpack-9c2d29f005c91b77.js',
					revision: 'NGnGK5z8i338qBz6btJlz',
				},
				{
					url: '/_next/static/css/622ab88043b698ea.css',
					revision: '622ab88043b698ea',
				},
				{
					url: '/_next/static/css/e8757e4f1e21f464.css',
					revision: 'e8757e4f1e21f464',
				},
				{
					url: '/_next/static/media/poppins-devanagari-100-normal.0662b626.woff2',
					revision: '0662b626',
				},
				{
					url: '/_next/static/media/poppins-devanagari-100-normal.7c3631a2.woff',
					revision: '7c3631a2',
				},
				{
					url: '/_next/static/media/poppins-devanagari-200-normal.3628add2.woff',
					revision: '3628add2',
				},
				{
					url: '/_next/static/media/poppins-devanagari-200-normal.ac614beb.woff2',
					revision: 'ac614beb',
				},
				{
					url: '/_next/static/media/poppins-devanagari-300-normal.6caeb1d9.woff',
					revision: '6caeb1d9',
				},
				{
					url: '/_next/static/media/poppins-devanagari-300-normal.e025c645.woff2',
					revision: 'e025c645',
				},
				{
					url: '/_next/static/media/poppins-devanagari-400-normal.87c72f23.woff2',
					revision: '87c72f23',
				},
				{
					url: '/_next/static/media/poppins-devanagari-400-normal.f2c29400.woff',
					revision: 'f2c29400',
				},
				{
					url: '/_next/static/media/poppins-devanagari-500-normal.21c3a342.woff',
					revision: '21c3a342',
				},
				{
					url: '/_next/static/media/poppins-devanagari-500-normal.839135d0.woff2',
					revision: '839135d0',
				},
				{
					url: '/_next/static/media/poppins-devanagari-600-normal.3828f203.woff2',
					revision: '3828f203',
				},
				{
					url: '/_next/static/media/poppins-devanagari-600-normal.6def6ad7.woff',
					revision: '6def6ad7',
				},
				{
					url: '/_next/static/media/poppins-devanagari-700-normal.20b8b8f6.woff2',
					revision: '20b8b8f6',
				},
				{
					url: '/_next/static/media/poppins-devanagari-700-normal.fb419fa1.woff',
					revision: 'fb419fa1',
				},
				{
					url: '/_next/static/media/poppins-devanagari-800-normal.8d1a51bb.woff2',
					revision: '8d1a51bb',
				},
				{
					url: '/_next/static/media/poppins-devanagari-800-normal.cb8552f9.woff',
					revision: 'cb8552f9',
				},
				{
					url: '/_next/static/media/poppins-devanagari-900-normal.51051a7e.woff2',
					revision: '51051a7e',
				},
				{
					url: '/_next/static/media/poppins-devanagari-900-normal.7abd9bce.woff',
					revision: '7abd9bce',
				},
				{
					url: '/_next/static/media/poppins-latin-100-normal.1aca1d18.woff',
					revision: '1aca1d18',
				},
				{
					url: '/_next/static/media/poppins-latin-100-normal.7a78f1ce.woff2',
					revision: '7a78f1ce',
				},
				{
					url: '/_next/static/media/poppins-latin-200-normal.900dc983.woff',
					revision: '900dc983',
				},
				{
					url: '/_next/static/media/poppins-latin-200-normal.d36a2a2b.woff2',
					revision: 'd36a2a2b',
				},
				{
					url: '/_next/static/media/poppins-latin-300-normal.33c2d521.woff',
					revision: '33c2d521',
				},
				{
					url: '/_next/static/media/poppins-latin-300-normal.c0455185.woff2',
					revision: 'c0455185',
				},
				{
					url: '/_next/static/media/poppins-latin-400-normal.74033fb9.woff',
					revision: '74033fb9',
				},
				{
					url: '/_next/static/media/poppins-latin-400-normal.916d3686.woff2',
					revision: '916d3686',
				},
				{
					url: '/_next/static/media/poppins-latin-500-normal.23c6f81d.woff',
					revision: '23c6f81d',
				},
				{
					url: '/_next/static/media/poppins-latin-500-normal.7777133e.woff2',
					revision: '7777133e',
				},
				{
					url: '/_next/static/media/poppins-latin-600-normal.94625d71.woff',
					revision: '94625d71',
				},
				{
					url: '/_next/static/media/poppins-latin-600-normal.d8692086.woff2',
					revision: 'd8692086',
				},
				{
					url: '/_next/static/media/poppins-latin-700-normal.1db5394e.woff',
					revision: '1db5394e',
				},
				{
					url: '/_next/static/media/poppins-latin-700-normal.9a881e2a.woff2',
					revision: '9a881e2a',
				},
				{
					url: '/_next/static/media/poppins-latin-800-normal.376dd8dc.woff2',
					revision: '376dd8dc',
				},
				{
					url: '/_next/static/media/poppins-latin-800-normal.910f489f.woff',
					revision: '910f489f',
				},
				{
					url: '/_next/static/media/poppins-latin-900-normal.8a0d091a.woff',
					revision: '8a0d091a',
				},
				{
					url: '/_next/static/media/poppins-latin-900-normal.bd427f25.woff2',
					revision: 'bd427f25',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-100-normal.1fe84a73.woff2',
					revision: '1fe84a73',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-100-normal.51f9fb13.woff',
					revision: '51f9fb13',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-200-normal.aefc8ad6.woff2',
					revision: 'aefc8ad6',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-200-normal.ca8d45ea.woff',
					revision: 'ca8d45ea',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-300-normal.953974ac.woff2',
					revision: '953974ac',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-300-normal.d3522ce6.woff',
					revision: 'd3522ce6',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-400-normal.591327bf.woff2',
					revision: '591327bf',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-400-normal.687cae43.woff',
					revision: '687cae43',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-500-normal.031e7b80.woff',
					revision: '031e7b80',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-500-normal.370d1cc3.woff2',
					revision: '370d1cc3',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-600-normal.10939fee.woff2',
					revision: '10939fee',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-600-normal.22fff013.woff',
					revision: '22fff013',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-700-normal.7493fc33.woff',
					revision: '7493fc33',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-700-normal.f93b79c1.woff2',
					revision: 'f93b79c1',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-800-normal.1b097aa1.woff2',
					revision: '1b097aa1',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-800-normal.96316983.woff',
					revision: '96316983',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-900-normal.1797ffc3.woff',
					revision: '1797ffc3',
				},
				{
					url: '/_next/static/media/poppins-latin-ext-900-normal.9b44cfc4.woff2',
					revision: '9b44cfc4',
				},
				{
					url: '/_next/static/media/rubik-arabic-wght-normal.061929e5.woff2',
					revision: '061929e5',
				},
				{
					url: '/_next/static/media/rubik-cyrillic-ext-wght-normal.5d8a2f66.woff2',
					revision: '5d8a2f66',
				},
				{
					url: '/_next/static/media/rubik-cyrillic-wght-normal.0c76dae7.woff2',
					revision: '0c76dae7',
				},
				{
					url: '/_next/static/media/rubik-hebrew-wght-normal.b3fbd938.woff2',
					revision: 'b3fbd938',
				},
				{
					url: '/_next/static/media/rubik-latin-ext-wght-normal.99e9567f.woff2',
					revision: '99e9567f',
				},
				{
					url: '/_next/static/media/rubik-latin-wght-normal.da6a0956.woff2',
					revision: 'da6a0956',
				},
				{
					url: '/img/berita/anya.jpg',
					revision: '8dce75a9a68ab629400a748204fcfa71',
				},
				{
					url: '/img/berita/shopee.png',
					revision: 'c47a734b3a71ce09cdd78d1654fa5943',
				},
				{
					url: '/img/berita/ultra_milk.png',
					revision: 'b1fc575540b9a1246266673cc36389a0',
				},
				{
					url: '/img/berita/zoom.png',
					revision: '4151cc9ca2f35ccb16dabb946f42ba69',
				},
				{
					url: '/img/fitur/bg.svg',
					revision: 'c8d6dcf43e16185bd832b485349b060d',
				},
				{
					url: '/img/fitur/bg_2.svg',
					revision: '2788c59034078acd110556495e0fc79a',
				},
				{
					url: '/img/fitur/chatroom.png',
					revision: '7293e352f4412cb40fdf3c92b1242005',
				},
				{
					url: '/img/fitur/forum_tanya_jawab.png',
					revision: 'bfeda446c622740220ad3eb23b43cc5f',
				},
				{
					url: '/img/fitur/menarik.png',
					revision: 'cb4fae010048fd88b6d72d1e51d10b98',
				},
				{
					url: '/img/fitur/music.png',
					revision: 'c68759c644b885b48c583661901668d6',
				},
				{
					url: '/img/fitur/private_chat.png',
					revision: '05f5811da39d793c8bc10709065c105f',
				},
				{
					url: '/img/fitur/tts.png',
					revision: '7feade9943b1c1b3ee81c4c9b1f61e60',
				},
				{
					url: '/img/fitur/unik.png',
					revision: '52dfa2321f811697e9a84c8f712358ef',
				},
				{
					url: '/img/fitur/verifikasi.png',
					revision: '65df497295d4be855b8b47fed91dc42f',
				},
				{
					url: '/img/hero_bg.svg',
					revision: '6517de2f80267c55ba872bd271193888',
				},
				{
					url: '/img/hero_img.png',
					revision: 'cc01db0c84d5cc1e923f17c1405cd882',
				},
				{
					url: '/img/home/mari-bertanya.png',
					revision: '93955fa7f33d300c9b22f7c9c6c76a0d',
				},
				{
					url: '/img/icon/facebook.svg',
					revision: '2eaf899581208519da8d78c75f8ff714',
				},
				{
					url: '/img/icon/google.png',
					revision: '6b50a36de01846d300bfc98b7d2b7242',
				},
				{
					url: '/img/icon/telegram.svg',
					revision: '82902a9e3f8a057176d2470c8041e4c6',
				},
				{
					url: '/img/icon/twitter.svg',
					revision: '48943146a03795b712d55d2fa735253e',
				},
				{
					url: '/img/icon/whatsapp.svg',
					revision: 'acfe02ac1df0dc214f18125047fab467',
				},
				{
					url: '/img/mapel/bg.svg',
					revision: '471e985f75241840125ada5169bc498b',
				},
				{
					url: '/img/mapel/indo.png',
					revision: '9bc46d0a94c8eb22c398b0bf060ed08d',
				},
				{
					url: '/img/mapel/ing.png',
					revision: '2daf942e3999971f5b5af731e0f253f7',
				},
				{
					url: '/img/mapel/ipa.png',
					revision: '7520e69e9d92bab6abfb05597633c536',
				},
				{
					url: '/img/mapel/ips.png',
					revision: 'ca137c8053c7388952b549d40de44965',
				},
				{
					url: '/img/mapel/matematika.png',
					revision: 'ed1655b3e153242c34868679e95987b8',
				},
				{
					url: '/img/mapel/other.png',
					revision: 'd452f0bfb71c548b37b4b3cdaa6c04a5',
				},
				{
					url: '/img/mapel/penjas.png',
					revision: 'a85b211b8b5b6c6943c512fd487dbd35',
				},
				{
					url: '/img/mapel/ppkn.png',
					revision: '5d8a2a81e877ac25e1485724956ac996',
				},
				{
					url: '/img/mapel/sejarah.png',
					revision: '61d9c9a75ef1990828628aa2f6e839cf',
				},
				{
					url: '/img/questions/jawaban-kosong.png',
					revision: '84ae998ac92845b962f8f9ed4904f0eb',
				},
				{
					url: '/img/search.svg',
					revision: 'a584d8b6adb42594834472f1ccfa869d',
				},
				{
					url: '/img/tentang_kami_bg.svg',
					revision: '36c645b79a9951edaf22c3f41ab30b24',
				},
				{
					url: '/img/tentang_kami_wave.svg',
					revision: '792ef2493deb26cd358921cc5131f59c',
				},
				{
					url: '/img/testimoni/bg.svg',
					revision: 'b9ae34326a9114f46f0c15d885890369',
				},
				{
					url: '/img/testimoni/yulianti.png',
					revision: 'c1408d3492b28cf2a6441def0d08fe45',
				},
				{
					url: '/img/testimoni/yulianti.svg',
					revision: '8a11dbaf9c9595713a480f906474f259',
				},
				{
					url: '/img/yukitanya_logo.png',
					revision: '84ea2e93eea576d83f95f55bb5e90f9f',
				},
			],
			{ ignoreURLParametersMatching: [] },
		),
		i.cleanupOutdatedCaches(),
		i.registerRoute(
			'/',
			new i.NetworkFirst({
				cacheName: 'start-url',
				plugins: [
					{
						cacheWillUpdate: async ({
							request: i,
							response: e,
							event: a,
							state: n,
						}) =>
							e && 'opaqueredirect' === e.type
								? new Response(e.body, {
										status: 200,
										statusText: 'OK',
										headers: e.headers,
								  })
								: e,
					},
				],
			}),
			'GET',
		),
		i.registerRoute(
			/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
			new i.CacheFirst({
				cacheName: 'google-fonts-webfonts',
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
			new i.StaleWhileRevalidate({
				cacheName: 'google-fonts-stylesheets',
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
			new i.StaleWhileRevalidate({
				cacheName: 'static-font-assets',
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
			new i.StaleWhileRevalidate({
				cacheName: 'static-image-assets',
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/\/_next\/image\?url=.+$/i,
			new i.StaleWhileRevalidate({
				cacheName: 'next-image',
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/\.(?:mp3|wav|ogg)$/i,
			new i.CacheFirst({
				cacheName: 'static-audio-assets',
				plugins: [
					new i.RangeRequestsPlugin(),
					new i.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/\.(?:mp4)$/i,
			new i.CacheFirst({
				cacheName: 'static-video-assets',
				plugins: [
					new i.RangeRequestsPlugin(),
					new i.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/\.(?:js)$/i,
			new i.StaleWhileRevalidate({
				cacheName: 'static-js-assets',
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/\.(?:css|less)$/i,
			new i.StaleWhileRevalidate({
				cacheName: 'static-style-assets',
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/\/_next\/data\/.+\/.+\.json$/i,
			new i.StaleWhileRevalidate({
				cacheName: 'next-data',
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			/\.(?:json|xml|csv)$/i,
			new i.NetworkFirst({
				cacheName: 'static-data-assets',
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			({ url: i }) => {
				if (!(self.origin === i.origin)) return !1;
				const e = i.pathname;
				return !e.startsWith('/api/auth/') && !!e.startsWith('/api/');
			},
			new i.NetworkFirst({
				cacheName: 'apis',
				networkTimeoutSeconds: 10,
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			({ url: i }) => {
				if (!(self.origin === i.origin)) return !1;
				return !i.pathname.startsWith('/api/');
			},
			new i.NetworkFirst({
				cacheName: 'others',
				networkTimeoutSeconds: 10,
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		i.registerRoute(
			({ url: i }) => !(self.origin === i.origin),
			new i.NetworkFirst({
				cacheName: 'cross-origin',
				networkTimeoutSeconds: 10,
				plugins: [
					new i.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
				],
			}),
			'GET',
		);
});
