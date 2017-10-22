/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import { ListRoute } from '../ListRoute';

describe('<ListRoute />', () => {
  test('renders', () => {
    const wrapper = shallow(<ListRoute />);
    expect(wrapper).toMatchSnapshot();
  });
});
