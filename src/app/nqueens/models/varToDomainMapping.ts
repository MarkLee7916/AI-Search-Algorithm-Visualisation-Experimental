import { sequenceBetween } from 'src/app/shared/genericUtils';
import { UncheckedObjMap } from 'src/app/shared/models/uncheckedObjMap';

// The list of possible values/tiles a variable/row could have
export type Domain = number[];

// A mapping between a variable/row and its domain
export type VarToDomainMapping = UncheckedObjMap<number, Domain>;

// True if two domains have the same values
export function areDomainsEqual(domain1: Domain, domain2: Domain): boolean {
  return domain1.every((_, index) => domain1[index] === domain2[index]);
}

// Create a deep copy of a VarToDomainMapping without mutating the original
export function deepCopyOfVarToDomain(
  varToDomain: VarToDomainMapping
): VarToDomainMapping {
  const varToDomainCopy = new UncheckedObjMap<number, Domain>([]);
  const vars = varToDomain.keys();

  vars.forEach((variable) => {
    varToDomainCopy.set(variable, [...varToDomain.get(variable)]);
  });

  return varToDomainCopy;
}

// Create an empty VarToDomainMapping where each variable/row has an empty domain
export function initEmptyVarToDomainMapping(
  boardSize: number
): VarToDomainMapping {
  const emptyKeyToValueArray = sequenceBetween(0, boardSize).map(
    (key) => [key, []] as [number, Domain]
  );

  return new UncheckedObjMap(emptyKeyToValueArray);
}

// Create a full VarToDomainMapping where each variable/row has an full domain
export function initDefaultVarToDomainMapping(
  boardSize: number
): VarToDomainMapping {
  const varToDomain = new UncheckedObjMap<number, Domain>([]);

  for (let variable = 0; variable < boardSize; variable++) {
    varToDomain.set(variable, sequenceBetween(0, boardSize));
  }

  return varToDomain;
}

// Create a VarToDomainMapping from a given list of variables and domains
export function initVarToDomainMappingWith(
  items: [number, Domain][]
): VarToDomainMapping {
  return new UncheckedObjMap<number, Domain>(items);
}
