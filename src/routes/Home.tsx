import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { shallow } from 'zustand/shallow';

import { PageStyle } from '@/config';
import { SUPPORTED_CHAINS } from '@/constants';

import AboutModal from '@/components/AboutModal';
import SecretsModal from '@/components/SecretsModal';
import WalletModal from '@/components/WalletModal';

import PageLayout from '@/layout/PageLayout';

import { useAlchemyStore } from '@/hooks/useAlchemy';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import { useBoundStore } from '@/stores/useBoundStore';

const Home: FunctionComponent = () => {
  const [
    walletInputs,
    setWalletInputs,
    showAboutModal,
    setShowAboutModal,
    showSecretsModal,
    setShowSecretsModal,
    showWalletModal,
    setShowWalletModal,
  ] = useBoundStore(
    (state) => [
      state.walletInputs,
      state.setWalletInputs,
      state.showAboutModal,
      state.setShowAboutModal,
      state.showSecretsModal,
      state.setShowSecretsModal,
      state.showWalletModal,
      state.setShowWalletModal,
    ],
    shallow,
  );
  const { wallets, walletDispatch } = usePersistentAppStore();
  const getCurrentBalance = useAlchemyStore((state) => state.getCurrentBalance);

  useEffect(
    () =>
      SUPPORTED_CHAINS.forEach((chain) =>
        wallets.forEach((wallet) => getCurrentBalance({ chain, address: wallet.walletAddress })),
      ),
    [],
  );

  useEffect(() => {
    if (!showWalletModal) {
      setWalletInputs(undefined);
    }
  }, [showWalletModal]);

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };
  const toggleSecretsModal = () => {
    setShowSecretsModal(!showSecretsModal);
  };
  const toggleWalletModal = () => {
    setShowWalletModal(!showWalletModal);
  };

  return (
    <>
      <PageLayout layoutStyle={PageStyle.MAIN} />
      <AboutModal showModal={showAboutModal} toggleModal={toggleAboutModal} />
      <WalletModal
        showModal={showWalletModal}
        dataToEdit={walletInputs}
        toggleModal={toggleWalletModal}
        dispatch={walletDispatch}
      />
      <SecretsModal showModal={showSecretsModal} toggleModal={toggleSecretsModal} />
    </>
  );
};

export default Home;
