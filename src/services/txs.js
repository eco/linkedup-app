const generateMsg = (acc, seq, msg) => ({
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

const claimKey = (acc, sec, addr, secret) =>
  generateMsg(acc, sec, {
    type: 'longy/MsgClaimKey',
    value: {
      AttendeeAddress: addr,
      Secret: secret,
    },
  })

export { claimKey }
