// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class SentMessage extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save SentMessage entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save SentMessage entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("SentMessage", id.toString(), this);
  }

  static load(id: string): SentMessage | null {
    return store.get("SentMessage", id) as SentMessage | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): i32 {
    let value = this.get("timestamp");
    return value.toI32();
  }

  set timestamp(value: i32) {
    this.set("timestamp", Value.fromI32(value));
  }

  get hash(): string {
    let value = this.get("hash");
    return value.toString();
  }

  set hash(value: string) {
    this.set("hash", Value.fromString(value));
  }

  get message(): Bytes {
    let value = this.get("message");
    return value.toBytes();
  }

  set message(value: Bytes) {
    this.set("message", Value.fromBytes(value));
  }
}

export class RelayedMessage extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save RelayedMessage entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save RelayedMessage entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("RelayedMessage", id.toString(), this);
  }

  static load(id: string): RelayedMessage | null {
    return store.get("RelayedMessage", id) as RelayedMessage | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get hash(): string {
    let value = this.get("hash");
    return value.toString();
  }

  set hash(value: string) {
    this.set("hash", Value.fromString(value));
  }

  get timestamp(): i32 {
    let value = this.get("timestamp");
    return value.toI32();
  }

  set timestamp(value: i32) {
    this.set("timestamp", Value.fromI32(value));
  }

  get msgHash(): string {
    let value = this.get("msgHash");
    return value.toString();
  }

  set msgHash(value: string) {
    this.set("msgHash", Value.fromString(value));
  }
}

export class Info extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Info entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Info entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Info", id.toString(), this);
  }

  static load(id: string): Info | null {
    return store.get("Info", id) as Info | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get count(): i32 {
    let value = this.get("count");
    return value.toI32();
  }

  set count(value: i32) {
    this.set("count", Value.fromI32(value));
  }

  get total(): BigInt {
    let value = this.get("total");
    return value.toBigInt();
  }

  set total(value: BigInt) {
    this.set("total", Value.fromBigInt(value));
  }
}

export class Withdrawal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Withdrawal entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Withdrawal entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Withdrawal", id.toString(), this);
  }

  static load(id: string): Withdrawal | null {
    return store.get("Withdrawal", id) as Withdrawal | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get hash(): string {
    let value = this.get("hash");
    return value.toString();
  }

  set hash(value: string) {
    this.set("hash", Value.fromString(value));
  }

  get timestamp(): i32 {
    let value = this.get("timestamp");
    return value.toI32();
  }

  set timestamp(value: i32) {
    this.set("timestamp", Value.fromI32(value));
  }

  get account(): Bytes {
    let value = this.get("account");
    return value.toBytes();
  }

  set account(value: Bytes) {
    this.set("account", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }
}
