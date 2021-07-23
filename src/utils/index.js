import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function fromPermissionsToEntities(permissions) {
  let entities = [];

  permissions.forEach((permission, i) => {
    const indexOfColon = permission.tag.indexOf(':');
    const entityName = permission.tag.substring(
      indexOfColon + 1,
      permission.tag.length,
    );
    const entityPermission = permission.tag.substring(0, indexOfColon);

    const existingEntity = entities.find(e => e.entityName === entityName);
    if (existingEntity) {
      entities = entities.filter(e => e.entityName !== entityName);
      entities = entities.concat({
        id: i,
        entityName,
        permissions: existingEntity.permissions.concat({
          id: permission.id,
          name: entityPermission,
        }),
      });
    } else {
      entities = entities.concat({
        id: i,
        entityName,
        permissions: [
          {
            id: permission.id,
            name: entityPermission,
          },
        ],
      });
    }
  });

  return entities;
}

export function getCssUtilities(variant) {
  if (variant === 'visuallyHidden') {
    return {
      position: 'absolute !important',

      height: '1px',
      width: '1px',

      clip: 'rect(1px, 1px, 1px, 1px)',
      overflow: 'hidden',
    };
  }

  return {};
}

export function hasSomePermissions(entity, permissions) {
  return (
    permissions[entity].create ||
    permissions[entity].read ||
    permissions[entity].update ||
    permissions[entity].delete ||
    permissions[entity].list ||
    permissions[entity].assign ||
    permissions[entity].upload
  );
}

export function hasPermissionAction(entity, action, permissions) {
  return permissions && permissions[entity] && permissions[entity][action];
}

export function hasRoles(roles, listToCheck) {
  let result = false;
  Object.entries(roles).forEach(([key, value]) => {
    if (listToCheck.includes(key)) {
      result = true;
    }
  });
  return result;
}

// export function redirect(context, target) {
//   if (context.res) {
//     context.res.writeHead(303, { Location: target });
//     context.res.end();
//   } else {
//     Router.pushRoute(target);
//   }
// }

export function useClickOutside(ref, cb) {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      cb();
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedogitwn', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
}

const cachedScripts = [];

export function useScript(src) {
  const [state, setState] = useState({
    loaded: false,
    error: false,
  });

  useEffect(() => {
    if (cachedScripts.includes(src)) {
      setState({
        loaded: true,
        error: false,
      });
    }
    cachedScripts.push(src);

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    const onScriptLoad = () => {
      setState({
        loaded: true,
        error: false,
      });
    };

    const onScriptError = () => {
      const index = cachedScripts.indexOf(src);
      if (index >= 0) cachedScripts.splice(index, 1);
      script.remove();

      setState({
        loaded: true,
        error: true,
      });
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
    };
  }, [src]);

  return [state.loaded, state.error];
}

export function changeTextFieldHandlerSimple({ params, field }) {
  const newVal = params.newValue;
  const { data } = params;
  if (data[field] !== newVal) {
    data[field] = newVal;
    data.isEdited = true;
    return data[field];
  }
  return data[field];
}

export function changeTextFieldHandler({ params, field, setEditedList, setEdited }) {
  const newVal = params.newValue;
  const { data } = params;
  if (data[field] !== newVal) {
    data[field] = newVal;
    data.isEdited = true;
    setEditedList(d => [...d.filter(x => x.id !== data.id), params.data]);
    setEdited(true);
    return data[field];
  }
  return data[field];
}

export function changeNumberFieldHandler({
  params,
  field,
  setEditedList,
  setEdited,
}) {
  const newVal = params.newValue;
  const { data } = params;
  if (!Number.isNaN(newVal) && data[field] !== newVal) {
    data[field] = newVal;
    data.isEdited = true;
    setEditedList(d => [...d.filter(x => x.id !== data.id), params.data]);
    setEdited(true);
  }
  return params.data[field];
}

export function changePositiveNumberHandler({
  params,
  field,
  setEdited,
  setEditedList,
}) {
  const { data } = params;
  if (Number(params.newValue) > 0) {
    setEditedList(d => [...d.filter(x => x.id !== data.id), params.data]);
    setEdited(true);
    data.isEdited = true;
    data[field] = params.newValue;
  }
  return data[field];
}

export const getEditedValue = cField => {
  const editedKeys = Object.keys(cField);
  let i = 0;
  while (i < editedKeys.length) {
    if (cField[editedKeys[i]]) return true;
    i += 1;
  }
  return false;
};

export const isMissingRequired = (cField, requiredKeys) => {
  // const requiredKeys = ['name'];
  let i = 0;
  while (i < requiredKeys.length) {
    if (!cField[requiredKeys[i]]) return true;
    i += 1;
  }
  return false;
};

export const handleEdited = (
  field,
  newValue,
  dataInfo,
  requiredFields,
  changedFields,
  requiredKeys,
  setRequiredFields,
  setMissingRequired,
  setChangedFieds,
  setIsEdited,
) => {
  const changedFieldsAux = { ...changedFields };
  changedFieldsAux[field] = dataInfo[field] !== newValue;
  setChangedFieds(changedFieldsAux);
  setIsEdited(getEditedValue(changedFieldsAux));
  const requiredFieldsAux = { ...requiredFields };
  requiredFieldsAux[field] = newValue;
  setRequiredFields(requiredFieldsAux);
  setMissingRequired(isMissingRequired(requiredFieldsAux, requiredKeys));
};

export const getObjectEdited = (field, newValue, dataInfo) => {
  const dataInfoAux = { ...dataInfo };
  dataInfoAux[field] = newValue;
  return dataInfoAux;
};

export function getStorageDate(date) {
  if (date) {
    const dateArray = date.split('T');
    dateArray.unshift(dateArray.pop());
    return dateArray.join('-');
  }
  return '';
}

export const timeFromDBToUI = x => {
  
  // analyze how to handle timezone
  if (x instanceof Date) {
    return format(x, 'HH:mm');
  }

  // when we send a UTC formated date, usually comes from DB
  if (x) {
    if (x.includes('T')) return format(new Date(x), 'HH:mm');
    return format(createDateTimeWithTime(x), 'HH:mm');
  }

  return x;
};

export const createDateTimeWithTime = x => {
  if (x instanceof Date) {
    return x;
  }

  if (x) {
    var currentDate = new Date();
    var stringTime = x.split(':');
    
    currentDate.setHours(stringTime[0]);
    currentDate.setMinutes(stringTime[1]);

    return currentDate;
  }
}

// use only on datapickers
export const dateFromDBToUI = x => {
  if (x instanceof Date) {
    return x;
  }

  if (x) {
    let  splitDate = x.split("-");  // ex input "2010-01-18"    
    return new Date(splitDate[0],splitDate[1]-1,  splitDate[2], 0, 0, 0, 0);
  }

  return x;
};

// only use on readonly components
export const dateTimeFromDBToUI = x => {
  // analyze how to handle timezone
  if (x instanceof Date) {
    return format(x, 'yyyy-MM-dd HH:mm');
  }

  if (x) return format(new Date(x), 'yyyy-MM-dd HH:mm');

  return x;
};

// now we are working directly with dates
export const dateFromUIToDB = x => {
  const value = x;
  // analyze how to handle timezone
  if (x instanceof Date) {
    return x.toISOString();
  }

  // maybe we are going to not use this code anymore, because we will work with dates directly
  if (value) {
    if (value.includes('T')) return x;
    // Not sure if this is the proper way to handle it
    // but the gist of it is that we add the timezone of the computer that triggers it
    const timezoneInfo = new Date().toISOString().split('T', 2)[1];
    return `${value}T${timezoneInfo}`;
  }
  return x;
};

export function getCurrentYear() {
  const currentDay = new Date();

  if (currentDay.getMonth() > 5) {
    const first = currentDay.getFullYear().toString().substring(2);
    const second = (currentDay.getFullYear() + 1).toString().substring(2);

    return `${first}${second}`;
  }
  const first = (currentDay.getFullYear() - 1).toString().substring(2);
  const second = currentDay.getFullYear().toString().substring(2);
  return `${first}${second}`;
}

export function filterActive(data) {
  return data.filter(x => x.status === 'Active');
}

export function debounce(fn, delayParam) {
  let timeoutId;
  return function d(...args) {
    clearInterval(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delayParam);
  };
}
