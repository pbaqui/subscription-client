import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import service from "services/UsuarioService";
import authService from "services/AuthService";

// import { useSponsor } from 'components/sponsor-provider';
// import { logout } from 'lib/auth';
import { fromPermissionsToEntities, hasPermissionAction } from 'utils';

import styles from './styles';

const useStyles = makeStyles(styles);

const defaultState = {};

const Context = React.createContext(defaultState);

export function useUser() {
  return React.useContext(Context);
}

export function UserProvider({ children }) {
  const classes = useStyles();
  // const { id: sponsorId, tag: sponsorTag } = useSponsor();

  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);

      let userData;

      try {
        userData = await service.getUsuarioDatos();
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        authService.signout();
        return;
      }
      // const userData = response;

      // const contactData = userData.contacts.find(c => c.sponsor.id === sponsorId);

      const { roles } = userData;
      const userRoles = {};

      // if (userData.backoffice) {
      //   userRoles['super-admin'] = true;
      // }

      roles.forEach(r => {
        if (r === 1) {
          userRoles.admin = true;
        } else if (r === 2) {
          userRoles.socio = true;
        } else if (r === 3) {
          userRoles.coach = true;
        }
      });

      const entitiesPermissions = fromPermissionsToEntities(userData.permisos);
      const userPermissions = {};

      entitiesPermissions.forEach(ep => {
        ep.permissions.forEach(p => {
          if (userPermissions[ep.entityName]) {
            userPermissions[ep.entityName][p.name] = true;
          } else {
            userPermissions[ep.entityName] = {};
            userPermissions[ep.entityName][p.name] = true;
          }
        });
      });

      const userHasPermission = (entity, action) => {
        return (
          userRoles['super-admin'] ||
          hasPermissionAction(entity, action, userPermissions)
        );
      };

      const userHasSomePermissions = entity => {
        return (
          userRoles['super-admin'] ||
          (userPermissions[entity] &&
            (userPermissions[entity].create ||
              userPermissions[entity].read ||
              userPermissions[entity].update ||
              userPermissions[entity].delete ||
              userPermissions[entity].list ||
              userPermissions[entity].assign ||
              userPermissions[entity].upload))
        );
      };

      setUser(u => ({
        ...u,
        id: userData.id,
        // picture: userData.picture,
        displayName: userData.presentacion,
        // notifications: userData.notifications,
        roles: userRoles,
        permissions: userPermissions,
        hasPermission: userHasPermission,
        hasSomePermissions: userHasSomePermissions,
      }));

      setIsLoading(false);
    }

    load();
  }, []);

  return (
    <>
      {/* {console.log("user2: ",user)} */}
      {isLoading && (
        <div className={classes.container}>
          <CircularProgress />
        </div>
      )}

      {!isLoading && user && (
        <Context.Provider value={user}>{children}</Context.Provider>
      )}
    </>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  // client: PropTypes.object.isRequired,
};
