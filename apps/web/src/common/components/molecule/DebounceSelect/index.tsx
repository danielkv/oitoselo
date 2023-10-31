import { Select, SelectProps, Spin } from 'antd'
import { debounce } from 'radash'
import { useMemo, useRef, useState } from 'react'

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetcher: (search: string) => Promise<ValueType[]>
    debounceTimeout?: number
}

function DebounceSelect<ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any>({
    fetcher: fetchOptions,
    debounceTimeout = 800,
    ...props
}: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState<ValueType[]>([])
    const fetchRef = useRef(0)

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1
            const fetchId = fetchRef.current
            setOptions([])
            setFetching(true)

            fetchOptions(value)
                .then((newOptions) => {
                    if (fetchId !== fetchRef.current) {
                        // for fetch callback order
                        return
                    }

                    setOptions(newOptions)
                })
                .finally(() => {
                    setFetching(false)
                })
        }

        return debounce({ delay: debounceTimeout }, loadOptions)
    }, [fetchOptions, debounceTimeout])

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
    )
}

export default DebounceSelect
