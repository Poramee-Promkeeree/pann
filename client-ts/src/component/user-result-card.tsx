import { Box } from "@mui/system";
import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Tooltip, Typography ,Paper} from "@mui/material"
import { useState } from "react";
import UserResult, { ResultType } from "../models/UserResult";
import Repo from '../repositories'
import { CheckCircle, PushPin, Close } from "@mui/icons-material";


interface Prop {
    userResult: UserResult
}

function UserResultCard(props: Prop) {
    const [userResult, setUserResult] = useState<UserResult>(props.userResult)
    const [popup, setPopup] = useState(false)
    const [pin,setPin] = useState(true)

    const onOpenPopup = async () => {
        if(!userResult.viewDateTime){
            const result = await Repo.userResult.view(userResult.id)
            if(result) {
                setUserResult(result)
                setPopup(true)
            }
        }else{
            setPopup(true)
        }
    }

    const handleAcknowledge = async () => {
        const result = await Repo.userResult.acknowledge(userResult.id)
        if(result) {
            setUserResult(result)
        }
    }

    const handleToggleIsPinned = async () => {
      const result = await Repo.userResult.toggleIsPinned(userResult.id,pin)
      if (pin == false){
        setPin(true)
        if (result) {
          setUserResult(result)
          //setPin(true)
        }
      }else{
        setPin(false)
        if (result) {
          //setPin(false)
          setUserResult(result)
        }
    }
      
  }

    const getConditionalRemark = () => {
        if(userResult.resultType === ResultType.POSITIVE){
            return userResult.announcement.remarkIfPositive
        }else if(userResult.resultType === ResultType.NEGATIVE){
            return userResult.announcement.remarkIfNegative
        }
    }

    return (
      <Paper sx={{ bgcolor:"#FF0000"}}>
          <Box>
            <Card sx={{ maxWidth: 500, height: 250 ,bgcolor:"#FFFFFF"}}>
              <CardHeader
                sx={{ height: '30%' }}
                title={userResult.announcement?.topic}
                subheader={new Date(userResult.announcement?.pubDateTime!.toString()).toLocaleString('en-GB')}
                action={
                  <IconButton color={userResult.isPinned ? "primary" : "default"} onClick={handleToggleIsPinned}>
                    <PushPin sx={{ fontSize: 30 }} />
                  </IconButton>
                }
              />
              <CardActionArea sx={{ height: '56%' }} onClick={onOpenPopup}>
                <CardContent sx={{ height: '40%' }}>
                  <Grid container spacing={2} columns={5}>
                    <Grid display="flex" justifyContent="center" alignItems="center" item xs={2}>
                      <Tooltip title={userResult.ackDateTime ? "Acknowledged" : "Unacknowledged"}>
                      <CheckCircle sx={{ fontSize: 60 }} color={userResult.ackDateTime ? "success" : "disabled"} />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="h5" component="div">
                        {userResult.result}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userResult.remark}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Typography variant="button" color="#FF0000">Read More</Typography>
                </CardActions>
              </CardActionArea>
            </Card>

            <Dialog PaperProps={{ sx: { minWidth: "50%", maxHeight: "55%" } }} open={popup} onClose={() => setPopup(false)}>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {userResult.announcement?.topic}
                <IconButton onClick={() => setPopup(false)}>
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {userResult.announcement?.description}
                </Typography >
                ผลประกาศ :
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {userResult.result}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userResult.remark}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  {getConditionalRemark()}
                </Typography>
              </DialogContent>
              { !userResult.ackDateTime && 
                <DialogActions>
                  <Button onClick={handleAcknowledge} >
                    Acknowledge
                  </Button>
                </DialogActions>
              }
            </Dialog>
          </Box>
      </Paper>
  )
}

export default UserResultCard
