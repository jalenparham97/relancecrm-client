import { useEffect } from 'react';
import { useRecoilSnapshot } from 'recoil';

export function DebugObserver() {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.log('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.log(`${node.key}:`, snapshot.getLoadable(node).contents);
    }
  }, [snapshot]);

  return null;
}
