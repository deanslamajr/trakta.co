/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { EditRoute } from '../EditRoute'

describe('<EditRoute />', () => {
  test('renders', () => {
    const wrapper = shallow(<EditRoute />)
    expect(wrapper).toMatchSnapshot()
  })
})
