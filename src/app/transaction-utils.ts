import {Transaction} from './api/models/transaction';
import BigNumber from 'bignumber.js';

export const transactionUtils = {

  valueSent:  (t: Transaction) => {
    let result = new BigNumber(0);
    t.messagesOut.forEach(m => {
      if (m.info.value) {
        result = result.add(m.info.value);
      }
    });
    return result.toString();
  },

  valueReceived:  (t: Transaction) => {
    let result = new BigNumber(0);
    if (t.messageIn && t.messageIn.info.value) {
      result = result.add(t.messageIn.info.value);
    }
    return result.toString();
  },

  balanceChange: (t: Transaction) => {
    let result = new BigNumber(0);
    result = result.sub(t.totalFees);
    if (t.messageIn && t.messageIn.info.value) {
      (result = result.add(t.messageIn.info.value));
    }
    t.messagesOut.forEach(m => {
      if (m.info.value) {
        result = result.sub(m.info.value);
      }
      if (m.info.fwdFee) {
        result = result.sub(m.info.fwdFee);
      }
      if (m.info.ihrFee) {
        result = result.sub(m.info.ihrFee);
      }
    });

    return result.toString();
  },

  fees: (t: Transaction) => {
    let fees = new BigNumber(0);
    fees = fees.add(t.totalFees);
    t.messagesOut.forEach(m => {
      if (m.info.fwdFee) {
        (fees = fees.add(m.info.fwdFee));
      }
      if (m.info.ihrFee) {
        (fees = fees.add(m.info.ihrFee));
      }
    });
    return fees.toString();
  }

};
