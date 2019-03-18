/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
import React, { Component } from 'react';
import DownloadIcon from 'mdi-react/DownloadIcon';
import DeleteIcon from 'mdi-react/DeleteIcon';
import { Col, Card, CardBody, Table } from 'reactstrap';
import PropTypes from 'prop-types';

const pointer = { cursor: 'pointer' };
export default class TemplateList extends Component {
  static propTypes = {
    templateList: PropTypes.arrayOf(PropTypes.object).isRequired,
    deletTemplate: PropTypes.func.isRequired,
    seletedTemplate: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      templateList: this.props.templateList,
    };
  }
  componentWillReceiveProps({ templateList }) {
    this.setState({ templateList });
  }
  onTemplateSeleted = (e, templateName) => {
    e.preventDefault();
    this.props.seletedTemplate(templateName);
  };
  onDeleteClick = (e, templateName) => {
    this.props.deletTemplate(templateName);
  };

  onDownloadClick = (e, templateName) => {
    window.open(`http://localhost:3001/api/templates/${templateName}/generate`);
  };
  render() {
    const templateList = this.state.templateList.map(t => (
      <tbody>
        <tr>
          <td>
            <a style={pointer} onClick={e => this.onTemplateSeleted(e, t.name)}>
              {t.name}
            </a>
          </td>
          <td>{t.create_date}</td>
          <td>{t.update_date}</td>
          <td>
            <DownloadIcon style={pointer} onClick={e => this.onDownloadClick(e, t.name)} />
            &nbsp;&nbsp;&nbsp;
            <DeleteIcon style={pointer} onClick={e => this.onDeleteClick(e, t.name)} />
          </td>
        </tr>
      </tbody>
    ));
    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">Template List</h5>
              <h5 className="subhead">
                Click on Template Name to Edit with Template Details From above or Click Action with Action what you
                want.
              </h5>
            </div>
            <Table className="table--bordered table--head-accent" responsive hover>
              <thead>
                <tr>
                  <th>Template Name</th>
                  <th>Create Date</th>
                  <th>Update Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              {templateList}
            </Table>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
