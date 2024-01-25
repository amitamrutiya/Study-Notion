import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)

  if (token !== null) { return children } else { return <Navigate to="/login" /> }
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PrivateRoute
