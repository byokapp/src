import { FunctionComponent } from 'preact';

import { getEnsAddress } from '@/hooks/useAlchemy';
import { Avatar, Box, TextField, Tooltip } from '@mui/material';
import { shortenHash } from '@/logic';
import { useBoundStore } from '@/stores/useBoundStore';
import { ENS_IMAGE } from '@/constants';

const EnsForm: FunctionComponent = ({}) => {
  const { ensName, setEnsName, ensAddress, setEnsAddress } = useBoundStore((state) => ({
    ensName: state.ensName,
    setEnsName: state.setEnsName,
    ensAddress: state.ensAddress,
    setEnsAddress: state.setEnsAddress,
  }));

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement> & { target: HTMLFormElement },
  ) => {
    setEnsName(event.target.value);
    if (event.target.value) {
      getEnsAddress(event.target.value, setEnsAddress);
    } else {
      setEnsAddress(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
      <Tooltip title={'ENS lookup'}>
        <Avatar src={ENS_IMAGE} alt="ENS lookup" sx={{ width: 24, height: 24 }} />
      </Tooltip>
      <TextField
        id="ens-lookup"
        label={shortenHash(ensAddress, 6)}
        value={ensName}
        variant="standard"
        type="search"
        onChange={handleOnChange}
        spellCheck={false}
      />
    </Box>
  );
};
export default EnsForm;
