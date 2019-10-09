export const createTx = (acc, seq, msg) => ({
  account_number: acc,
  sequence: seq,
  chain_id: 'longychain',
  fee: {
    amount: [
      {
        amount: '0',
        denom: 'uatom',
      },
    ],
    gas: '200000',
  },
  msgs: [msg],
  memo: '',
})

export const claimKey = ({ attendeeAddress, secret }) => ({
  type: 'longy/MsgClaimKey',
  value: {
    attendeeAddress,
    secret,
  },
})

export const scanQr = ({ sender, scannedQR, data }) => ({
  type: 'longy/MsgScanQr',
  value: {
    sender,
    scannedQR,
    data,
  },
})