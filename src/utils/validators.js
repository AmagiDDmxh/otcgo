import { withParams, req } from 'vuelidate/lib/validators/common'

export const decimal = decimal =>
    withParams({ type: 'decimal', decimal }, value =>
    req(value) || (/^[0-9]+(\.[0-9]{1,8})?$/g.test(value)))
