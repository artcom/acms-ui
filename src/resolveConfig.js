const defaultProperties = {
  title: null,
  logoImageUri: null,
  contentPath: "content",
  templatesPath: "templates",
  childrenLabel: "Children",
  fieldsLabel: "Fields",
  saveLabel: "Save"
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

const defaultLanguage = {
  id: "en",
  name: "English",
  textDirection: "ltr"
}

const defaultLanguages = [
  defaultLanguage
]

export default function resolveConfig({ users, languages, ...properties }) {
  return {
    ...defaultProperties,
    ...properties,
    languages: resolveLanguages(languages),
    users: resolveUsers(users)
  }
}

function resolveLanguages(languages) {
  if (!Array.isArray(languages) || languages.length === 0) {
    return defaultLanguages
  }

  return languages.map(language => resolveLanguage(language))
}

function resolveLanguage({ id, name = id, textDirection = defaultLanguage.textDirection }) {
  return { id, name, textDirection }
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
