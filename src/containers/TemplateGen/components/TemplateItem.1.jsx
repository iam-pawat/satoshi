/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TemplateItem extends Component {
  static propTypes = {
    fieldList: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    regex: PropTypes.string.isRequired,
    actionClick: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    fieldChange: PropTypes.func.isRequired,
    isFixed: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      regex: this.props.regex,
      number: this.props.number,
      name: this.props.name,
    };
  }

  onFieldChange = () => {
    const { name, number, regex } = this.state;
    const field = this.props.fieldList.filter(f => f.name === name);
    console.log(field[0].name, field[0].isFixed);
    this.props.fieldChange({
      id: this.props.fieldId,
      name,
      number: field[0].isFixed ? '0' : number,
      regex: field[0].isFixed ? '' : regex,
    });
  };

  onFieldNameChange = async (e) => {
    e.preventDefault();
    const field = this.props.fieldList.filter(f => f.name === e.target.value);
    // await this.setState({ isFixed: fieldSeleted[0].isFixed, name: e.target.value });
    console.log(e.target.value);
    if (field[0].isFixed) {
      await this.setState({ regex: '', number: '0', name: e.target.value });
    } else {
      await this.setState({ name: e.target.value });
    }
    this.onFieldChange();
  };
  onRegexChange = async (e) => {
    e.preventDefault();
    this.setState({ regex: e.target.value }, () => {
      this.onFieldChange();
    });
  };
  onKeyPress = (event) => {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  };

  onNumberChange = async (e) => {
    e.preventDefault();
    await this.setState({ number: e.target.value });
    this.onFieldChange();
  };

  onActionClick = (e) => {
    e.preventDefault();
    // await this.onFieldChange();
    console.log(1234);
    this.props.actionClick(this.props.action, this.props.fieldId);
  };
  render() {
    let numberlist;
    let regexTextBox;
    if (!this.props.isFixed) {
      numberlist = (
        <select onKeyPress={this.onKeyPress} onChange={e => this.onNumberChange(e)} value={this.props.number}>
          {'0123456789'.split('').map(i => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      );
      regexTextBox = (
        <span>
          Regex :{' '}
          <input
            onKeyPress={this.onKeyPress}
            type="text"
            value={this.props.regex}
            defaultValue=""
            onChange={e => this.onRegexChange(e)}
          />
        </span>
      );
    }
    return (
      <div>
        {this.props.fieldId}
        <button onClick={e => this.onActionClick(e)} value={this.props.action}>
          {this.props.action}
        </button>
        <select onKeyPress={this.onKeyPress} onChange={e => this.onFieldNameChange(e)} value={this.props.name}>
          {this.props.fieldList.map(field => (
            <option key={field.name} value={field.name}>
              {field.name}
            </option>
          ))}
        </select>
        {numberlist}
        {regexTextBox}
      </div>
    );
  }
}
