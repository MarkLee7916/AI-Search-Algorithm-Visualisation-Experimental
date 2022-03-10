import { sequenceBetween } from 'src/app/shared/genericUtils';
import { UncheckedObjMap } from 'src/app/shared/models/uncheckedObjMap';

export type Domain = number[];

export type VarToDomainMapping = UncheckedObjMap<number, Domain>;

export function areDomainsEqual(domain1: Domain, domain2: Domain): boolean {
  return domain1.every((_, index) => domain1[index] === domain2[index]);
}

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

export function initEmptyVarToDomainMapping(
  boardSize: number
): VarToDomainMapping {
  const emptyKeyToValueArray = sequenceBetween(0, boardSize).map(
    (key) => [key, []] as [number, Domain]
  );

  return new UncheckedObjMap(emptyKeyToValueArray);
}

export function initDefaultVarToDomainMapping(
  boardSize: number
): VarToDomainMapping {
  const varToDomain = new UncheckedObjMap<number, Domain>([]);

  for (let variable = 0; variable < boardSize; variable++) {
    varToDomain.set(variable, sequenceBetween(0, boardSize));
  }

  return varToDomain;
}

export function initVarToDomainMappingWith(
  items: [number, Domain][]
): VarToDomainMapping {
  return new UncheckedObjMap<number, Domain>(items);
}
