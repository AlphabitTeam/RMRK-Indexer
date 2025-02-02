import { RmrkInteraction } from './types'
import { CollectionEntity, NFTEntity } from '../../types'
import { ExtraCall } from './extract'
// import { decodeAddress } from '@polkadot/util-crypto'
type Entity = CollectionEntity | NFTEntity

export function exists<T>(entity: T | undefined): boolean {
  return !!entity
}

export function isBurned(nft: NFTEntity) {
  return nft.burned
}

export function isTransferable(nft: NFTEntity) {
  return !!nft.transferable
}

export function hasMeta(nft: RmrkInteraction): nft is RmrkInteraction {
  return !!nft.metadata
}

export function isOwner(entity: Entity, caller: string) {
  return entity.currentOwner === caller
}

export function isIssuer(entity: Entity, caller: string) {
  return entity.issuer === caller
}


export function isOwnerOrElseError(entity: Entity, caller: string) {
  if (!isOwner(entity, caller)) {
    throw new ReferenceError(`[CONSOLIDATE Bad Owner] Entity: ${entity.issuer} Caller: ${caller}`)
  }
}

export function canOrElseError<T>(callback: (arg: T) => boolean, entity: T, negation?: boolean) {
  if (negation ? !callback(entity) : callback(entity)) {
    throw new ReferenceError(`[CONSOLIDATE canOrElseError] Callback${negation ? ' not' : ''} ${callback.name}`)
  }
}

export function validateNFT(nft: NFTEntity) {
  try {
    canOrElseError<NFTEntity>(exists, nft, true)
    canOrElseError<NFTEntity>(isBurned, nft)
    canOrElseError<NFTEntity>(isTransferable, nft, true)
  } catch (e) {
    throw e
  }
}

export function validateMeta(interaction: RmrkInteraction) {
  try {
    canOrElseError<RmrkInteraction>(hasMeta, interaction, true);
  } catch (e) {
    throw e
  }
}

export function isPositiveOrElseError(entity: BigInt | number, excludeZero?: boolean) {
  if (entity < Number(excludeZero)) {
    throw new ReferenceError(`[CONSOLIDATE isPositiveOrElseError] Entity: ${entity}`)
  }
}


const isBalanceTransfer = ({ section, method }: ExtraCall) => section === 'balances' && method === 'transfer'
const canBuy = (nft: NFTEntity) => (call: ExtraCall) => isBalanceTransfer(call) && isOwner(nft, call.args[0]) && BigInt(call.args[1]) >= BigInt(nft.price)

export function isBuyLegalOrElseError(entity: NFTEntity, extraCalls: ExtraCall[]) {
  const result = extraCalls.some(canBuy(entity))
  if (!result) {
    throw new ReferenceError(`[CONSOLIDATE ILLEGAL BUY] Entity: ${entity.id} CALLS: ${JSON.stringify(extraCalls)}`)
  }
}
export function unwrapBuyPrice(entity: NFTEntity, extraCalls: ExtraCall[]) {

  try {
    if (extraCalls && extraCalls.length > 0) {
      let price = BigInt(extraCalls[0].args[1]);
      return price;
    }
    return 0;
  } catch (error) {
    throw new ReferenceError(`[CONSOLIDATE ILLEGAL PRICE FOR BUY InTERACTION] Entity: ${entity.id} CALLS: ${JSON.stringify(extraCalls)}`);
  }
}

