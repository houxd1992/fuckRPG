import React from 'react';
import { Popover, Timeline, Button, Modal, Form, Input, message } from 'antd';
import * as calendarApi from '../services/calendar';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class CalendarTimeLine extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showDeleteModal: false,
            deleteId: null,
            deleteLoading: false,
            showEditModal: false,
            editItem: {},
            editLoading: false,
        }
    }

    componentDidMount (){
        this.props.dispatch({
            type: 'app/loadAllCalendar'
        })
    }

    hideDeleteModal() {
        this.setState({
            showDeleteModal: false
        })
    }

    deleteCalendarById(id) {
        if(this.state.deleteLoading) return;
        this.setState({
            deleteLoading: true
        })
        calendarApi.del({id})
            .then((res) => {
                this.setState({
                    deleteLoading: false
                })
                this.hideDeleteModal()
                this.props.dispatch({
                    type: 'app/loadAllCalendar'
                })
            })
    }

    confirmDelete () {
        return (
            <Modal 
                title="确认删除？"
                visible={this.state.showDeleteModal}
                onCancel={this.hideDeleteModal.bind(this)}
                footer={null}
            >
                不可逆操作，是否确认删除第 {this.state.deleteId} 天？
                <div style={{paddingTop: '40px'}}>
                    <Button
                        type="primary" 
                        onClick={()=>{this.deleteCalendarById(this.state.deleteId)}} 
                        loading={this.state.deleteLoading}
                        style={{marginRight: '20px'}}
                    >删除</Button>
                    <Button onClick={this.hideDeleteModal.bind(this)}>取消</Button>
                </div>
            </Modal>
        )
    }

    hideEditModal () {
        this.setState({
            showEditModal: false
        })
    }

    handelEditSubmit = (e) => {
        e.preventDefault();
        if(this.state.editLoading)return;
        this.props.form.validateFields((err, values) => {
            if(!err) {
                this.setState({
                    editLoading: true
                })
                console.log(values)
                calendarApi.modify(values)
                    .then((res) => {
                        let { data } = res;
                        if( data.result === 'success'){
                            this.hideEditModal();
                            this.props.dispatch({
                                type: 'app/loadAllCalendar'
                            })
                        } else {
                            message.error(data.message)
                        }
                        this.setState({
                            editLoading: false
                        })
                    })
                    .catch(e => {

                    })
            }
        })
    }

    modifyCalendar () {
        const { getFieldDecorator } = this.props.form;
        let item = this.state.editItem;
        return (
            <Modal
                title = "修改日历"
                visible = {this.state.showEditModal}
                onCancel = {this.hideEditModal.bind(this)}
                footer = {null}
            >
                <Form onSubmit={this.handelEditSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('id', {
                            rules: [{ required: true, message: 'id获取异常！' }],
                        })(
                        <Input type="hidden" placeholder="id" />
                    )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('days', {
                            rules: [{ required: true, message: '输入天数！' }],
                        })(
                        <Input placeholder="天数" />
                    )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '输入标题！' }],
                        })(
                        <Input placeholder="标题" />
                    )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remark', {
                            rules: [{ required: true, message: '输入备注！' }],
                        })(
                        <Input placeholder="备注" />
                    )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: '输入详情！' }],
                        })(
                        <TextArea placeholder="详情" />
                    )}
                    </FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.editLoading}>
                        提交
                    </Button>
                </Form>
            </Modal>
        )
    }

    handleDelete(id) {
        this.setState({
            showDeleteModal: true,
            deleteId: id
        })
    }

    showEditModal(item) {
        this.setState({
            showEditModal: true,
            editItem: item
        })
        this.props.form.setFieldsValue(item)
    }

    render() {
        let rili = this.props.dongshifu;
        let admin = this.props.accessToken;
        return (
            <Timeline style={{ width: 400, padding: '28px 60px', marginLeft: '44px' }}>
                {
                    rili.map((item, i) => 
                        <Timeline.Item key={i} id={`Timeline-${item.day}`}>
                            <label>
                                第 <em style={{ color: '#108ee9' }}>{item.id}</em> 天
                            </label>
                            <p style={{ padding: '0 0 0 20px' }}>- {item.title}</p>
                            <Popover placement="right" content={item.description || item.work} title={`第 ${item.id} 天`} trigger="hover">
                                <p style={{textAlign: 'right'}}>
                                    <Button>> 详情</Button>
                                    { admin ?
                                        <div>
                                            <Button onClick={() => this.handleDelete(item.id)}>删除</Button>
                                            <Button onClick={() => this.showEditModal(item)}>编辑</Button>
                                        </div> : null
                                    }
                                </p>
                            </Popover>
                        </Timeline.Item>
                        )
                }
                {this.confirmDelete()}
                {this.modifyCalendar()}
            </Timeline>
        )
    }
}

const CalendarTimeLineForm = Form.create()(CalendarTimeLine);

export default CalendarTimeLineForm;