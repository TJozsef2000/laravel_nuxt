declare global {
  var navigateTo: (path: string) => void
  var useSanctumClient: () => any
  var useSanctumUser: () => { value: any }
  var useSanctumAuth: () => {
    login: any
    logout: any
    refreshIdentity: any
  }
  var ref: (value: any) => { value: any }
  var reactive: (value: any) => any
  var computed: (fn: () => any) => { value: any }
  var watch: any
  var readonly: (value: any) => any
  var unref: (value: any) => any
}

export {}