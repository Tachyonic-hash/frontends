// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class BridgeMigrated extends ethereum.Event {
  get params(): BridgeMigrated__Params {
    return new BridgeMigrated__Params(this);
  }
}

export class BridgeMigrated__Params {
  _event: BridgeMigrated;

  constructor(event: BridgeMigrated) {
    this._event = event;
  }

  get oldBridge(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newBridge(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class CacheUpdated extends ethereum.Event {
  get params(): CacheUpdated__Params {
    return new CacheUpdated__Params(this);
  }
}

export class CacheUpdated__Params {
  _event: CacheUpdated;

  constructor(event: CacheUpdated) {
    this._event = event;
  }

  get name(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get destination(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Deposit extends ethereum.Event {
  get params(): Deposit__Params {
    return new Deposit__Params(this);
  }
}

export class Deposit__Params {
  _event: Deposit;

  constructor(event: Deposit) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ExportedVestingEntries extends ethereum.Event {
  get params(): ExportedVestingEntries__Params {
    return new ExportedVestingEntries__Params(this);
  }
}

export class ExportedVestingEntries__Params {
  _event: ExportedVestingEntries;

  constructor(event: ExportedVestingEntries) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get escrowedAccountBalance(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get vestingEntries(): Array<ExportedVestingEntriesVestingEntriesStruct> {
    return this._event.parameters[2].value.toTupleArray<
      ExportedVestingEntriesVestingEntriesStruct
    >();
  }
}

export class ExportedVestingEntriesVestingEntriesStruct extends ethereum.Tuple {
  get endTime(): BigInt {
    return this[0].toBigInt();
  }

  get escrowAmount(): BigInt {
    return this[1].toBigInt();
  }
}

export class OwnerChanged extends ethereum.Event {
  get params(): OwnerChanged__Params {
    return new OwnerChanged__Params(this);
  }
}

export class OwnerChanged__Params {
  _event: OwnerChanged;

  constructor(event: OwnerChanged) {
    this._event = event;
  }

  get oldOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnerNominated extends ethereum.Event {
  get params(): OwnerNominated__Params {
    return new OwnerNominated__Params(this);
  }
}

export class OwnerNominated__Params {
  _event: OwnerNominated;

  constructor(event: OwnerNominated) {
    this._event = event;
  }

  get newOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class RewardDeposit extends ethereum.Event {
  get params(): RewardDeposit__Params {
    return new RewardDeposit__Params(this);
  }
}

export class RewardDeposit__Params {
  _event: RewardDeposit;

  constructor(event: RewardDeposit) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class WithdrawalCompleted extends ethereum.Event {
  get params(): WithdrawalCompleted__Params {
    return new WithdrawalCompleted__Params(this);
  }
}

export class WithdrawalCompleted__Params {
  _event: WithdrawalCompleted;

  constructor(event: WithdrawalCompleted) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class SynthetixBridgeToOptimism extends ethereum.SmartContract {
  static bind(address: Address): SynthetixBridgeToOptimism {
    return new SynthetixBridgeToOptimism("SynthetixBridgeToOptimism", address);
  }

  activated(): boolean {
    let result = super.call("activated", "activated():(bool)", []);

    return result[0].toBoolean();
  }

  try_activated(): ethereum.CallResult<boolean> {
    let result = super.tryCall("activated", "activated():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isResolverCached(): boolean {
    let result = super.call(
      "isResolverCached",
      "isResolverCached():(bool)",
      []
    );

    return result[0].toBoolean();
  }

  try_isResolverCached(): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isResolverCached",
      "isResolverCached():(bool)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  nominatedOwner(): Address {
    let result = super.call("nominatedOwner", "nominatedOwner():(address)", []);

    return result[0].toAddress();
  }

  try_nominatedOwner(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "nominatedOwner",
      "nominatedOwner():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  resolver(): Address {
    let result = super.call("resolver", "resolver():(address)", []);

    return result[0].toAddress();
  }

  try_resolver(): ethereum.CallResult<Address> {
    let result = super.tryCall("resolver", "resolver():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  resolverAddressesRequired(): Array<Bytes> {
    let result = super.call(
      "resolverAddressesRequired",
      "resolverAddressesRequired():(bytes32[])",
      []
    );

    return result[0].toBytesArray();
  }

  try_resolverAddressesRequired(): ethereum.CallResult<Array<Bytes>> {
    let result = super.tryCall(
      "resolverAddressesRequired",
      "resolverAddressesRequired():(bytes32[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytesArray());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _resolver(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AcceptOwnershipCall extends ethereum.Call {
  get inputs(): AcceptOwnershipCall__Inputs {
    return new AcceptOwnershipCall__Inputs(this);
  }

  get outputs(): AcceptOwnershipCall__Outputs {
    return new AcceptOwnershipCall__Outputs(this);
  }
}

export class AcceptOwnershipCall__Inputs {
  _call: AcceptOwnershipCall;

  constructor(call: AcceptOwnershipCall) {
    this._call = call;
  }
}

export class AcceptOwnershipCall__Outputs {
  _call: AcceptOwnershipCall;

  constructor(call: AcceptOwnershipCall) {
    this._call = call;
  }
}

export class CompleteWithdrawalCall extends ethereum.Call {
  get inputs(): CompleteWithdrawalCall__Inputs {
    return new CompleteWithdrawalCall__Inputs(this);
  }

  get outputs(): CompleteWithdrawalCall__Outputs {
    return new CompleteWithdrawalCall__Outputs(this);
  }
}

export class CompleteWithdrawalCall__Inputs {
  _call: CompleteWithdrawalCall;

  constructor(call: CompleteWithdrawalCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class CompleteWithdrawalCall__Outputs {
  _call: CompleteWithdrawalCall;

  constructor(call: CompleteWithdrawalCall) {
    this._call = call;
  }
}

export class InitiateDepositCall extends ethereum.Call {
  get inputs(): InitiateDepositCall__Inputs {
    return new InitiateDepositCall__Inputs(this);
  }

  get outputs(): InitiateDepositCall__Outputs {
    return new InitiateDepositCall__Outputs(this);
  }
}

export class InitiateDepositCall__Inputs {
  _call: InitiateDepositCall;

  constructor(call: InitiateDepositCall) {
    this._call = call;
  }

  get depositAmount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class InitiateDepositCall__Outputs {
  _call: InitiateDepositCall;

  constructor(call: InitiateDepositCall) {
    this._call = call;
  }
}

export class InitiateRewardDepositCall extends ethereum.Call {
  get inputs(): InitiateRewardDepositCall__Inputs {
    return new InitiateRewardDepositCall__Inputs(this);
  }

  get outputs(): InitiateRewardDepositCall__Outputs {
    return new InitiateRewardDepositCall__Outputs(this);
  }
}

export class InitiateRewardDepositCall__Inputs {
  _call: InitiateRewardDepositCall;

  constructor(call: InitiateRewardDepositCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class InitiateRewardDepositCall__Outputs {
  _call: InitiateRewardDepositCall;

  constructor(call: InitiateRewardDepositCall) {
    this._call = call;
  }
}

export class MigrateBridgeCall extends ethereum.Call {
  get inputs(): MigrateBridgeCall__Inputs {
    return new MigrateBridgeCall__Inputs(this);
  }

  get outputs(): MigrateBridgeCall__Outputs {
    return new MigrateBridgeCall__Outputs(this);
  }
}

export class MigrateBridgeCall__Inputs {
  _call: MigrateBridgeCall;

  constructor(call: MigrateBridgeCall) {
    this._call = call;
  }

  get newBridge(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class MigrateBridgeCall__Outputs {
  _call: MigrateBridgeCall;

  constructor(call: MigrateBridgeCall) {
    this._call = call;
  }
}

export class NominateNewOwnerCall extends ethereum.Call {
  get inputs(): NominateNewOwnerCall__Inputs {
    return new NominateNewOwnerCall__Inputs(this);
  }

  get outputs(): NominateNewOwnerCall__Outputs {
    return new NominateNewOwnerCall__Outputs(this);
  }
}

export class NominateNewOwnerCall__Inputs {
  _call: NominateNewOwnerCall;

  constructor(call: NominateNewOwnerCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class NominateNewOwnerCall__Outputs {
  _call: NominateNewOwnerCall;

  constructor(call: NominateNewOwnerCall) {
    this._call = call;
  }
}

export class NotifyRewardAmountCall extends ethereum.Call {
  get inputs(): NotifyRewardAmountCall__Inputs {
    return new NotifyRewardAmountCall__Inputs(this);
  }

  get outputs(): NotifyRewardAmountCall__Outputs {
    return new NotifyRewardAmountCall__Outputs(this);
  }
}

export class NotifyRewardAmountCall__Inputs {
  _call: NotifyRewardAmountCall;

  constructor(call: NotifyRewardAmountCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class NotifyRewardAmountCall__Outputs {
  _call: NotifyRewardAmountCall;

  constructor(call: NotifyRewardAmountCall) {
    this._call = call;
  }
}

export class RebuildCacheCall extends ethereum.Call {
  get inputs(): RebuildCacheCall__Inputs {
    return new RebuildCacheCall__Inputs(this);
  }

  get outputs(): RebuildCacheCall__Outputs {
    return new RebuildCacheCall__Outputs(this);
  }
}

export class RebuildCacheCall__Inputs {
  _call: RebuildCacheCall;

  constructor(call: RebuildCacheCall) {
    this._call = call;
  }
}

export class RebuildCacheCall__Outputs {
  _call: RebuildCacheCall;

  constructor(call: RebuildCacheCall) {
    this._call = call;
  }
}