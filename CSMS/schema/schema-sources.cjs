const schemaSourceGroups = [
  {
    directory: "governed",
    backendPointer: "./schema/governed/**/*.graphql",
    frontendPointer: "../CSMS/schema/governed/**/*.graphql"
  },
  {
    directory: "app/types",
    backendPointer: "./schema/app/types/**/*.graphql",
    frontendPointer: "../CSMS/schema/app/types/**/*.graphql"
  },
  {
    directory: "app/extensions",
    backendPointer: "./schema/app/extensions/**/*.graphql",
    frontendPointer: "../CSMS/schema/app/extensions/**/*.graphql"
  },
  {
    directory: "app/operations",
    backendPointer: "./schema/app/operations/**/*.graphql",
    frontendPointer: "../CSMS/schema/app/operations/**/*.graphql"
  }
];

module.exports = {
  runtimeSchemaDirectories: schemaSourceGroups.map((group) => group.directory),
  backendSchemaPointers: schemaSourceGroups.map((group) => group.backendPointer),
  frontendSchemaPointers: schemaSourceGroups.map((group) => group.frontendPointer)
};
