/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import { MainRoute } from '../MainRoute';

describe('<MainRoute />', () => {
  test('renders', () => {
    const wrapper = shallow(<MainRoute />);
    expect(wrapper).toMatchSnapshot();
  });
});
