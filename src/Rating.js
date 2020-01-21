import React from 'react'
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

export const RatingComponent = (props) => (
    <div className="rating" style={{maxWidth: 200, padding: 10}}>
        <Typography component="legend">My talk <PictureAsPdfIcon color="primary" /></Typography>
        <Rating name="half-rating" value={props.rating} precision={0.5} />
    </div>
)

const RatingPage = (props) => {
    const rating = Number(props.match.params.rating);

    return (
        <div className="loaded">
            <RatingComponent rating={rating} />
        </div>
    )
}

export default RatingPage