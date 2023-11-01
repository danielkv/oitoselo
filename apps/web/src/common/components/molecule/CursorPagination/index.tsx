import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex } from 'antd'

interface CursorPaginationProps {
    setPage(page: number): void
    currentPage: number
    nextDisabled?: boolean
    prevDisabled?: boolean
    loading?: boolean
}

const CursorPagination: React.FC<CursorPaginationProps> = ({
    currentPage,
    setPage,
    nextDisabled,
    prevDisabled,
    loading,
}) => {
    return (
        <Flex gap={10} justify="center">
            <Button
                disabled={prevDisabled}
                loading={loading}
                icon={<LeftOutlined />}
                onClick={() => setPage(currentPage - 1)}
            />
            <Button
                disabled={nextDisabled}
                loading={loading}
                icon={<RightOutlined />}
                onClick={() => setPage(currentPage + 1)}
            />
        </Flex>
    )
}

export default CursorPagination
