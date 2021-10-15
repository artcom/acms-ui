const defaultProperties = {
  title: null,
  logoImageUri: null,
  contentPath: "content",
  templatesPath: "templates",
  childrenLabel: "Children",
  fieldsLabel: "Fields",
  saveLabel: "Save",
  textDirection: "ltr"
}

const defaultInclude = [
  "**"
]

const defaultExclude = []

const defaultPermissions = {
  include: defaultInclude,
  exclude: defaultExclude
}

const defaultUser = {
  id: "admin",
  name: "Admin",
  permissions: defaultPermissions
}

const defaultUsers = [
  defaultUser
]

const defaultLanguages = []

export default function resolveConfig({ users, languages, ...properties }) {
  const resolvedProperties = { ...defaultProperties, ...properties }
  return {
    ...resolvedProperties,
    languages: resolveLanguages(languages, resolvedProperties.textDirection),
    users: resolveUsers(users)
  }
}

function resolveLanguages(languages, defaultTextDirection) {
  return Array.isArray(languages)
    ? languages.map(
      ({ id, name = id, textDirection = defaultTextDirection }) => ({ id, name, textDirection })
    )
    : defaultLanguages
}

function resolveUsers(users) {
  if (!Array.isArray(users) || users.length === 0) {
    return defaultUsers
  }

  return users.map(user => resolveUser(user))
}

function resolveUser({ id, name = id, permissions = defaultPermissions }) {
  return { id, name, permissions: resolvePermissions(permissions) }
}

function resolvePermissions({ include = defaultInclude, exclude = defaultExclude }) {
  return { include, exclude }
}
