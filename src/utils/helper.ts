import { template } from '../data/entity-template';

export const createEntity: any = (
  modelPackage: string,
  entityName: string,
  props: any[]
) => {
  console.log({ props });
  let result = {};
  const constants: string = props
    .map((e) => {
      return 'String ' + e.name + ' = "' + e.name + '";';
    })
    .join('\n\t');
  const code: string = props
    .map((e) => {
      return (
        getCapital(e.type == 'object' ? e.name : e.type) +
        ' get' +
        getCapital(e.name) +
        '();\n\tvoid' +
        ' set' +
        getCapital(e.name) +
        '(' +
        getCapital(e.type == 'object' ? e.name : e.type) +
        ' ' +
        e.name +
        ');'
      );
    })
    .join('\n\n\t');
  result[entityName] = template
    .replaceAll('{modelPackage}', modelPackage)
    .replaceAll('{entityName}', entityName)
    .replaceAll('{constants}', constants)
    .replaceAll('{code}', code);

  props.forEach((e) => {
    if (e.type == 'object') {
      const tmp = createEntity(
        modelPackage,
        getCapital(e.name),
        getChild(e.val)
      );
      result = { ...result, ...tmp };
    } else if (e.type.startsWith('list<')) {
      const tmp = createEntity(
        modelPackage,
        getCapital(e.name),
        getChild(e.val[0])
      );
      result = { ...result, ...tmp };
    }
  });

  // console.log({ result });

  return result;
};

function getChild(val) {
  return Object.entries(val).map((n) => {
    return {
      name: n[0],
      type: Array.isArray(n[1]) ? `list<${getCapital(n[0])}>` : typeof n[1],
      val: n[1],
    };
  });
}

export function getCapital(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
