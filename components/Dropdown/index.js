import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function Dropdown(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (item) => {
    setAnchorEl(null);

    Object.values(item).forEach((item)=>{
      if(item instanceof Object) 
        if(Object.keys(item).indexOf('children') !== -1)
          props.action(item.children);
    });
  };

  return (
    <div>
      <Button variant='contained' color='primary' id={props.id} className={props.className} onClick={handleClick}>
        {props.title}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.children ? props.children.map((item) => {
          return <MenuItem onClick={()=>{handleClose(item)}}>{item}</MenuItem>
        }) : null}
      </Menu>
    </div>
  );
}