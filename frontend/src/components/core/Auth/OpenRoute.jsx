// This will prevent authenticated users from accessing this route
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

function OpenRoute ({ children }) {
  const { token } = useSelector((state) => state.auth)

  if (token === null) {
    return children
  } else {
    return <Navigate to="/dashboard/my-profile" />
  }
}

OpenRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OpenRoute
