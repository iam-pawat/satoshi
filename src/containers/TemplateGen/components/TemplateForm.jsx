/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Card, CardBody, Container, Row, ButtonToolbar, Button } from 'reactstrap';
import _ from 'lodash';
import TemplateItem from './TemplateItem';

export default class TemplateForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    fieldItems: PropTypes.arrayOf(Object).isRequired,
    templateName: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      templateName: this.props.templateName,
      fieldItems: this.props.fieldItems,
      /* [
        {
          id: _.uniqueId('field_item_'),
          name: 'DeviceTime',
          number: '0',
          regex: '',
        },
      ], */
      fieldList: [
        { name: 'DeviceTime', isFixed: false },
        { name: 'user', isFixed: false },
        { name: 'action', isFixed: false },
        { name: 'proto', isFixed: false },
        { name: 'category', isFixed: false },
        { name: 'application', isFixed: false },
        { name: 'url', isFixed: false },
        { name: 'srcIP', isFixed: false },
        { name: 'dstIP', isFixed: false },
        { name: 'srcPort', isFixed: false },
        { name: 'dstPort', isFixed: false },
        { name: 'Sender', isFixed: false },
        { name: 'Recipient', isFixed: false },
        { name: 'filename', isFixed: false },
        { name: 'threat', isFixed: false },
        { name: 'translatedPort', isFixed: false },
        { name: 'translatedIP', isFixed: false },
        { name: 'Timestamp', isFixed: true },
        { name: 'DeviceIP', isFixed: true },
        { name: 'Severity', isFixed: true },
        { name: 'Facility', isFixed: true },
        { name: 'Syslogtag', isFixed: true },
        { name: 'Message', isFixed: true },
      ],
    };
  }
  componentWillReceiveProps({ fieldItems, templateName }) {
    this.setState({ fieldItems, templateName });
  }
  onTemplateNameChange = async (e) => {
    await this.setState({ templateName: e.target.value });
    console.log(this.state);
  };
  onFieldOfFiledITemChange = async (fieldItem) => {
    const {
      id, name, number, regex,
    } = fieldItem;

    await this.setState(prevState => ({
      fieldItems: prevState.fieldItems.map((i) => {
        if (i.id === id) {
          return {
            id,
            name,
            regex,
            number,
          };
        }
        return i;
      }),
    }));
  };

  onActionOfFiledItemClick = async (action, fieldId) => {
    const { name } = this.state.fieldList[0];
    if (action === '+') {
      await this.setState({
        fieldItems: [
          ...this.state.fieldItems,
          {
            id: _.uniqueId('field_item_'),
            name,
            number: '0',
            regex: '',
          },
        ],
      });
    } else {
      await this.setState({ fieldItems: this.state.fieldItems.filter(i => i.id !== fieldId) });
    }
  };
  onKeyPress = (event) => {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  };
  onSubmit = (event) => {
    event.preventDefault();
    const { fieldItems, templateName } = this.state;
    this.props.handleSubmit({ fieldItems, templateName });
  };

  onReset = (event) => {
    event.preventDefault();
    this.props.handleReset(this.state.fieldList[0]);
  };

  render() {
    return (
      <Col xs={12} md={12} lg={12} xl={12}>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">Template Details</h5>
              <h5 className="subhead">
                Enter a New template name if you want to create or click the existing template in Template List below
                that you want to edit
              </h5>
            </div>
            <form className="form form--horizontal">
              <Container>
                <Row>
                  <Col xl={6}>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Name</span>
                      <div className="form__form-group-field">
                        <input
                          onKeyPress={this.onKeyPress}
                          type="text"
                          value={this.state.templateName}
                          onChange={e => this.onTemplateNameChange(e)}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col xl={12}>
                    {this.state.fieldItems.map((item, index) => {
                      const field = this.state.fieldList.filter(i => i.name === item.name);
                      return (
                        <TemplateItem
                          key={item.id}
                          fieldId={item.id}
                          fieldList={this.state.fieldList}
                          name={item.name}
                          number={item.number}
                          regex={item.regex}
                          action={index === this.state.fieldItems.length - 1 ? '+' : '-'}
                          actionClick={this.onActionOfFiledItemClick}
                          fieldChange={this.onFieldOfFiledITemChange}
                          isFixed={field[0].isFixed}
                        />
                      );
                    })}
                  </Col>
                </Row>
                <Row>
                  <Col xl={12}>
                    <ButtonToolbar className="form__button-toolbar">
                      <Button color="primary" type="submit" onClick={this.onSubmit}>
                        Save
                      </Button>
                      <Button type="button" onClick={this.onReset}>
                        Clear
                      </Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </Container>
            </form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
