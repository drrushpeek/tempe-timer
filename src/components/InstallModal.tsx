import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Monitor, 
  Download, 
  Share2, 
  Check, 
  Copy, 
  Layers, 
  Sparkles,
  ArrowRight,
  Rocket,
  Globe
} from 'lucide-react';
import { Language } from '../utils/i18n';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: 'dark' | 'light';
  onDownloadHtml: () => void;
  deferredPrompt: any;
  onPromptInstall: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  language,
  theme,
  onDownloadHtml,
  deferredPrompt,
  onPromptInstall,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isTr = language === 'tr';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          theme === 'dark' 
            ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-indigo-950/40' 
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isTr ? 'Tempo Nasıl Yüklenir?' : 'How to Install Tempo?'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isTr ? 'Telefona, bilgisayara veya internetsiz tek dosya olarak yükle' : 'Install on phone, desktop, or offline single file'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Option 1: Native One-Click Install if browser prompt is ready */}
          {deferredPrompt && (
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-indigo-400">
                  {isTr ? 'Tek Tıkla Uygulama Olarak Yükle' : 'One-Click Instant Install'}
                </p>
                <p className="text-xs text-slate-400">
                  {isTr ? 'Tarayıcın bu uygulamayı doğrudan cihazına kurmayı destekliyor.' : 'Your browser supports installing Tempo directly.'}
                </p>
              </div>
              <button
                onClick={onPromptInstall}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 whitespace-nowrap active:scale-95 transition-all"
              >
                {isTr ? 'Şimdi Yükle' : 'Install Now'}
              </button>
            </div>
          )}

          {/* Option 2: Mobile Install (iPhone & Android) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
              <Smartphone className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isTr ? '1. Telefona Yükleme (iPhone & Android)' : '1. Mobile Install (iPhone & Android)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* iPhone */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> iPhone (Safari)
                </span>
                <ol className="list-decimal list-inside text-slate-600 dark:text-slate-300 space-y-1 pl-1">
                  <li>{isTr ? "Safari'de bu sayfayı aç." : 'Open this page in Safari.'}</li>
                  <li>
                    {isTr ? (
                      <>Alttaki <strong>Paylaş</strong> <Share2 className="w-3 h-3 inline mx-0.5" /> butonuna bas.</>
                    ) : (
                      <>Tap <strong>Share</strong> <Share2 className="w-3 h-3 inline mx-0.5" /> below.</>
                    )}
                  </li>
                  <li>
                    {isTr ? (
                      <><strong>"Ana Ekrana Ekle"</strong> seçeneğini seç.</>
                    ) : (
                      <>Select <strong>"Add to Home Screen"</strong>.</>
                    )}
                  </li>
                </ol>
              </div>

              {/* Android */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Android (Chrome)
                </span>
                <ol className="list-decimal list-inside text-slate-600 dark:text-slate-300 space-y-1 pl-1">
                  <li>{isTr ? "Chrome'da bu sayfayı aç." : 'Open this page in Chrome.'}</li>
                  <li>{isTr ? "Sağ üstteki 3 nokta (⋮) menüsüne bas." : 'Tap the 3 dots (⋮) top right.'}</li>
                  <li>
                    {isTr ? (
                      <><strong>"Uygulamayı Yükle"</strong> veya <strong>"Ana Ekrana Ekle"</strong> de.</>
                    ) : (
                      <>Tap <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</>
                    )}
                  </li>
                </ol>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isTr 
                ? '✨ Ana ekranına tıpkı App Store veya Google Play uygulaması gibi logosuyla eklenir ve tam ekran çalışır!' 
                : '✨ It launches in standalone full-screen mode like a native app!'}
            </p>
          </div>

          {/* Option 3: Desktop Install (PC / Mac) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center gap-2 text-violet-500 dark:text-violet-400">
              <Monitor className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isTr ? '2. Bilgisayara Masaüstü Uygulaması Olarak Kurma' : '2. Desktop App Install (PC / Mac)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isTr 
                ? 'Google Chrome veya Microsoft Edge kullanırken adres çubuğunun en sağındaki monitör/yükle simgesine tıklayarak doğrudan masaüstünüze kurabilirsiniz.' 
                : 'In Chrome or Edge, click the Install App icon on the right side of the URL address bar to run it as a standalone desktop window.'}
            </p>
          </div>

          {/* Option 4: Standalone Single File HTML (Offline) */}
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
                <Download className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isTr ? '3. Tek Başına Çalışan HTML Dosyası (.html)' : '3. Standalone Single HTML (.html)'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-medium">
                {isTr ? 'İnternetsiz Çalışır' : 'Works Offline'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isTr 
                ? 'Sunucu, kurulum veya node.js gerekmez. İndirdiğin dosyaya çift tıklayarak internetsiz dahi istediğin her bilgisayarda açabilirsin.' 
                : 'Zero installation or servers required. Double click the downloaded file to use it in any browser even without internet.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={onDownloadHtml}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{isTr ? 'Tek Dosya HTML İndir (.html)' : 'Download Single HTML (.html)'}</span>
              </button>
              <a
                href={`/index.standalone.html?t=${Date.now()}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span>{isTr ? 'Yeni Sekmede Aç' : 'Open in New Tab'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Option 4: Vercel / Cloud Deployment */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Rocket className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isTr ? '4. Vercel\'da Ücretsiz Yayınlama (Deploy)' : '4. Free Deploy on Vercel'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold">
                {isTr ? 'Hazır Yapılandırıldı' : 'Pre-configured'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isTr 
                ? 'Proje Vercel için tam hazırlandı (vercel.json, .gitignore, Vite yapılandırması). GitHub deponuza aktarıp Vercel\'da "Import" diyerek tek tıkla yayınlayabilirsiniz.' 
                : 'Configured for Vercel with vercel.json, .gitignore, and Vite. Push to GitHub and click Import in Vercel to publish in 30 seconds.'}
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 text-[11px] font-mono text-emerald-300 border border-emerald-500/20 space-y-1">
              <div><strong>Framework:</strong> Vite</div>
              <div><strong>Build Command:</strong> npm run build</div>
              <div><strong>Output Directory:</strong> dist</div>
            </div>
          </div>

          {/* Option 5: Copy Link to send to Phone */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs">
            <span className="text-slate-600 dark:text-slate-400 truncate mr-2">
              {isTr ? 'Telefonuna göndermek için bağlantıyı kopyala:' : 'Copy URL to send to your phone:'}
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-all shrink-0 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">{isTr ? 'Kopyalandı!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isTr ? 'Linki Kopyala' : 'Copy Link'}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            {isTr ? 'Kapat' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
