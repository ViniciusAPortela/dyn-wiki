import React from 'react'
import { Card, CardContent, Button } from '@material-ui/core'
import Link from 'next/link'
import './articleview.css'

export default class ArticleView extends React.Component{
  render(){
    return(
      <div>
        <Card className='card'>
          <CardContent>
            <div className='row'>
              <div className='article-image'>
                {this.props.img && <img className='article-inside-image' src={`/articles/${this.props.article}/images/${this.props.img}`}/>}
              </div>
              <div className='column'>
                <div>
                  <span className='article-title'>{this.props.title}</span> [{this.props.lang}]
                </div>
                <span>{this.props.desc}</span>
                <Link href={this.props.link}>
                  <Button className='article-button' variant='contained'>
                      Acess
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}