import { BigInt } from '@graphprotocol/graph-ts';
import {
  RelayedMessage,
  SentMessage as SentMessageEvent,
} from '../generated/OVM_CrossDomainMessenger/OVM_CrossDomainMessenger';
import { Deposit as DepositEvent } from '../generated/SynthetixBridgeToOptimism/SynthetixBridgeToOptimism';
import { ReceivedMessage, Deposit, SentMessage, Stats } from '../generated/schema';
// import

// OVM cross domain messenger
export function handleMessageReceived(event: RelayedMessage): void {
  const msgReceived = new ReceivedMessage(event.params.msgHash.toHex());
  msgReceived.hash = event.transaction.hash.toHex();
  msgReceived.timestamp = event.block.timestamp.toI32();
  msgReceived.msgHash = event.params.msgHash.toHex();
  msgReceived.save();
}

export function handleSentMessage(event: SentMessageEvent): void {
  const sentMessage = new SentMessage(event.transaction.hash.toHex() + '-' + event.logIndex.toString());
  sentMessage.timestamp = event.block.timestamp.toI32();
  sentMessage.txHash = event.transaction.hash.toHex();
  sentMessage.message = event.params.message;
  sentMessage.save();
}

// SNX deposit contract
export function handleDeposit(event: DepositEvent): void {
  const STATS_ID = '1';
  // create a stats entity if this is the first event, else update the existing one
  let stats = Stats.load(STATS_ID);
  if (stats == null) {
    stats = new Stats(STATS_ID);
    stats.count = 0;
    stats.total = BigInt.fromI32(0);
  }
  stats.count = stats.count + 1;
  stats.total.plus(event.params.amount);
  stats.save();

  const deposit = new Deposit(event.transaction.hash.toHex());
  deposit.timestamp = event.block.timestamp.toI32();
  deposit.hash = event.transaction.hash.toHex();
  deposit.account = event.params.account;
  deposit.amount = event.params.amount;
  deposit.save();
}
