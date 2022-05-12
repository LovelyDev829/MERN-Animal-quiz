import './App.css';
import React, {Component} from 'react';
import axios from 'axios';

class App extends Component  {

  constructor(props) {
    super(props);
    this.state = {

      parentId: '-1',
      path: 'y',
      leafname: '',
      content: '',

      text:'',
      subtext: '',
      learning: false,
      step: 0,

      isClosed: false,
      isBegin: true,
      isEnd: false
    }
  }

  componentDidMount = () => {
    this.getFirstQuestion();
  }

  getFirstQuestion = async() =>  {
    console.log(this.state.parentId, this.state.path);
    let newQuestion = await axios.get(`http://127.0.0.1:5000/question/${this.state.parentId}/${this.state.path}`);
    console.log(newQuestion)
    if(!newQuestion.data)  {
      newQuestion = await axios.post('http://127.0.0.1:5000/question/first');
    }
    if(this.state.isBegin === true)  {
      this.setState({
        text: 'Think about an animal....',
        isBegin: false
      });
    }
    else{
      this.setState({
        text: ''
      })
    }

    const question = newQuestion.data;
    console.log(question);

    if(question.leaf === true)  {
      this.setState({
        parentId: question._id.toString(),
        subtext: `Is it ${question.content}?`,
        content: question.content,
        isEnd: true
      });
      return;
    }
    this.setState({
      parentId: question._id.toString(),
      content: question.content,
      subtext: question.content
    });
  }


  answerSubmit = async(e) => {
    e.preventDefault();
    const ans = e.target.value;

    if(e.keyCode === 13)  {
      if(this.state.learning === false) {

        if(this.state.isEnd === true) {
          if(ans === 'y') {
            this.setState({
              text: 'I win. Pretty smart, aren\' t I?',
              subtext: 'Play again?',
              step: 3,
              learning: true
            });
            return;
          }
          this.setState({
            text: 'You win. Help me learn from my mistake before you go...',
            subtext: 'What animal were you thinking of?',
            learning: true
          });
          return;
        }
        await this.setState({
          path: ans
        });
        this.getFirstQuestion();
        return;
      }
      
      this.setQuestionText(this.state.step, ans);
    }
  }

  setQuestionText = async(step, ans) => {

    if(step === 0)  {
      this.setState({
        text: `Give me a question to distinguish ${ans} from ${this.state.content}.`,
        subtext: '',
        step: 1,
        leafname: ans
      });
      return;
    }

    if(step === 1) {
      this.setState({
        text: `For ${this.state.leafname}, what is the answer to your question?`,
        subtext: '',
        step: 2,
        content: ans
      });
      return;
    }
    if(step === 2)  {
      console.log('hello');
      await axios.post('http://127.0.0.1:5000/question', {
        oldId: this.state.parentId,
        content: this.state.content,
        ans,
        newContent: this.state.leafname
      });

      this.setState({
        text: 'Thanks. Play again?',
        subtext: '',
        step: 3,
        path: ans
      });

      return;
    }

    if(ans === 'n') {
      this.setState({
        isClosed: true
      });
      return;
    }

    await this.setState({
      learning: false,
      step: 0,
      parentId: '-1',
      path: 'y',
      isEnd: false,
      leafname: '',
      content: '',
      isBegin: true
    });
    this.getFirstQuestion();
  }

  render()  {
    if(this.state.isClosed) {
      return <></>
    }
    return(
      <div>
        <div>
          {this.state.text}
        </div>
        <div>
          {this.state.subtext}
        </div>
        <input key={this.state.text} type="text" className='mt-3' onKeyUp={this.answerSubmit.bind(this)} autoFocus></input>
      </div>
    );
  }
}

export default App;
