function usePendingTxHash(hash?: string) {
  const setPendingTxHash = (_hash: string) => {
    if (_hash) {
      localStorage.setItem('pendingTxHash', String(_hash));
    } else {
      localStorage.removeItem('pendingTxHash');
    }
  };
  if (hash) {
    setPendingTxHash(hash);
  }

  const pendingTxHash = localStorage.getItem('pendingTxHash');

  return [pendingTxHash, setPendingTxHash];
}

export default usePendingTxHash;
