import { UploadOutlined } from '@ant-design/icons'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { sendReportUseCase } from '@useCases/reports/sendReport'
import { Button, DatePicker, Form, Modal, Upload, UploadFile, UploadProps, message } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

interface IUploadForm {
    date: Dayjs
}

const UploadReport: React.FC = () => {
    const [file, setFile] = useState<UploadFile | null>(null)
    const [loading, setLoading] = useState(false)
    const [modalOpen, setOpen] = useState(false)
    const [form] = Form.useForm()

    const handleSubmit = async (formValues: IUploadForm) => {
        if (!file) return

        try {
            setLoading(true)

            await sendReportUseCase({ file, date: formValues.date.format('YYYY-MM-DD') })
            form.resetFields()
            setFile(null)

            setOpen(false)

            message.success('Relatório enviado com sucesso')
        } catch (err) {
            Modal.error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
        } finally {
            setLoading(false)
        }
    }

    const props: UploadProps = {
        onRemove: () => {
            setFile(null)
        },
        beforeUpload: (file) => {
            setFile(file)

            return false
        },
        maxCount: 1,
        fileList: file ? [file] : [],
    }

    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)} icon={<UploadOutlined />}>
                Enviar um relatório
            </Button>
            <Modal
                closable
                onOk={() => form.submit()}
                centered
                okText="Enviar"
                confirmLoading={loading}
                title="Enviar um relatório"
                onCancel={() => {
                    form.resetFields()
                    setOpen(false)
                }}
                cancelButtonProps={{ hidden: true }}
                open={modalOpen}
            >
                <Form
                    disabled={loading}
                    onReset={() => {
                        setFile(null)
                    }}
                    initialValues={{ date: dayjs(), file: null }}
                    onFinish={handleSubmit}
                    form={form}
                >
                    <Form.Item<IUploadForm> name="date" rules={[{ required: true, message: 'Data é obrigatória' }]}>
                        <DatePicker format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item
                        name="file"
                        rules={[{ type: 'object', required: true, message: 'Arquivo é obrigatório' }]}
                    >
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Selecionar arquivo</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UploadReport
