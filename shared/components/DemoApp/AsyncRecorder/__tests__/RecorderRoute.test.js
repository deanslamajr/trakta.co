/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import RecorderRoute from '../RecorderRoute';

describe('<RecorderRoute />', () => {
  test('renders', () => {
    const wrapper = shallow(<RecorderRoute />);
    expect(wrapper).toMatchSnapshot();
  });
});
