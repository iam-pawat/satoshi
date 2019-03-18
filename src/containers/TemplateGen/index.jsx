/* eslint-disable no-alert */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import _ from 'lodash';

import TemplateForm from './components/TemplateForm';
import TemplateList from './components/TemplateList';

const defaultField = [
  {
    id: _.uniqueId('field_item_'),
    name: 'DeviceTime',
    number: '0',
    regex: '',
  },
];
export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      templateList: [],
      templateName: '',
      fieldItems: defaultField,
    };
  }
  componentDidMount = () => {
    fetch('/api/templates')
      .then(response => response.json())
      .then((data) => {
        this.setState({ templateList: data });
      });
  };
  onDeletTemplate = (templateName) => {
    fetch(`/api/templates/${templateName}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          templateList: data,
        });
      });
    console.log(templateName);
  };
  onTemplateSeleted = (templateName) => {
    fetch(`/api/templates/${templateName}/details`)
      .then(response => response.json())
      .then((data) => {
        this.setState({ fieldItems: data, templateName });
      });
  };
  onTemplateDeleteClick = (templateName) => {
    fetch(`/api/templates/${templateName}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({ templateList: data, fieldItems: defaultField, templateName: '' });
      });
  };
  onSubmit = async (templateVal) => {
    const reg = /^[A-Za-z_\d]+$/;
    console.log(reg.test(`${templateVal.templateName}`));
    if (!reg.test(`${templateVal.templateName}`)) {
      alert('Invalid Template Name, must be A-Z, a-z, _ only');
    } else {
      console.log('The link was clicked.', JSON.stringify(templateVal));
      fetch('/api/templates/', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateVal), // body data type must match "Content-Type" header
      })
        .then(response => response.json())
        .then((data) => {
          this.setState({ templateList: data, fieldItems: defaultField, templateName: '' });
          alert('save success');
        });
    }
  };

  onReset = async (firstFieldItem) => {
    this.setState({ fieldItems: [firstFieldItem], templateName: '' });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col md={12}>
            <h3 className="page-title">Log Tempalte Generator</h3>
            <h3 className="page-subhead subhead">Create, Modify NetEvid Log Template</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div>
              <TemplateForm
                handleSubmit={this.onSubmit}
                handleReset={this.onReset}
                fieldItems={this.state.fieldItems}
                templateName={this.state.templateName}
              />
              <TemplateList
                templateList={this.state.templateList}
                seletedTemplate={this.onTemplateSeleted}
                deletTemplate={this.onTemplateDeleteClick}
              />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
