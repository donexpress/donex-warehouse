import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import 'styles/sidebar.scss';

interface SidebarProps {
  isOpen: boolean;
  isDesktop: boolean;
  onClose: () => void;
  inOms: boolean;
  inWms: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: '240px',
      flexShrink: 0,
      height: 'calc(100vh - 116px)',
      top: '60px !important',
    },
    drawerPaper: {
      width: '240px',
      height: 'calc(100vh - 116px)',
      top: '60px !important',
      background: 'linear-gradient(to bottom, #175898, #00a9e7)',
      boxShadow: '10px 0 10px -5px rgba(0, 0, 0, 0.2)',
      color: '#cccccc',
      overflowY: 'scroll',
      scrollbarWidth: 'thin',
      scrollbarColor: 'transparent transparent',
    },
    iconStyle: {
      color: '#cccccc',
    },
    toolbar: theme.mixins.toolbar,
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em',
      },
      '*::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '*::-webkit-scrollbar-thumb': {
        background: 'transparent',
      },
    },
  }),
);

const SidebarRightMenu = ({ isOpen, isDesktop, onClose, inOms, inWms }: SidebarProps) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="temporary"
      anchor="left"
      open={isOpen}
      onClose={onClose}
      classes={{
        paper: classes.drawerPaper,
      }}
      BackdropProps={{
        classes: {
            root: isDesktop ? 'custom-backdrop' : undefined
          }
      }}
    >
      {inWms && (
      <List>
        <ListItem button>
          <ListItemIcon><InboxIcon className={classes.iconStyle} /></ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><MailIcon className={classes.iconStyle} /></ListItemIcon>
          <ListItemText primary="Starred" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><InboxIcon className={classes.iconStyle} /></ListItemIcon>
          <ListItemText primary="Send email" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><MailIcon className={classes.iconStyle} /></ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>
      </List>
      )}

      {inOms && (
      <List>
        <ListItem button>
          <ListItemIcon><InboxIcon className={classes.iconStyle} /></ListItemIcon>
          <ListItemText primary="InboxOms" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><MailIcon className={classes.iconStyle} /></ListItemIcon>
          <ListItemText primary="StarredOms" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><InboxIcon className={classes.iconStyle} /></ListItemIcon>
          <ListItemText primary="Send emailOms" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><MailIcon className={classes.iconStyle} /></ListItemIcon>
          <ListItemText primary="DraftsOms" />
        </ListItem>
      </List>
      )}
    </Drawer>
  );
};

export default SidebarRightMenu;
