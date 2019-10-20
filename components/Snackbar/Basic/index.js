import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

export default function BasicSnackbar(props) {
  //const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    props.changeOpen(true);
  };

  const handleClose = (event, reason) => {
    //Case of clickaway
    /*if (reason === 'clickaway') {
      return;
    }*/
    
    props.changeOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        key={`bottom,center`}
        autoHideDuration={2500}
        open={props.opened}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{props.content}</span>}
      />
    </div>
  );
}