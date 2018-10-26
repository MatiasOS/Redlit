import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ManageDevicesAccordionView extends Component {
  renderDevices() {
    return this.props.devices.map((item, index) => (
      <li key={index} className="device">
        <p className="device-name">{item.name}</p>
        <p className="device-status">{item.name}</p>
        <button onClick={() => this.props.confirmAction()} className="device-btn icon-minus-circle" />
      </li>
    ));
  }

  render() {
    return <ul className="devices-list">{this.renderDevices()}</ul>;
  }
}

ManageDevicesAccordionView.propTypes = {
  devices: PropTypes.array,
  confirmAction: PropTypes.func
};

export default ManageDevicesAccordionView;
