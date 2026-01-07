import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Form',
  setup() {
    const router = useRouter()
    const isSubmitting = ref(false)

    const relationshipOptions = [
      '家人',
      '親戚',
      '同事',
      '同學',
      '朋友',
      '其他'
    ]

    const formData = ref({
      name: '',
      phone: '',
      relationship: '',
      customRelationship: '',
      side: '',
      willAttend: 'yes',
      attendees: 1,
      mealType: '葷食',
      needChildSeat: 'no',
      childSeatCount: 0,
      needInvitation: 'no',
      invitationRecipient: '',
      invitationAddress: '',
      invitationPhone: '',
      blessing: '',
      note: ''
    })

    const submitForm = async () => {
      isSubmitting.value = true

      try {
        // 準備送出的資料
        const dataToSubmit = {
          name: formData.value.name,
          phone: formData.value.phone,
          relationship: formData.value.relationship === '其他'
            ? formData.value.customRelationship
            : formData.value.relationship,
          side: formData.value.side,
          willAttend: formData.value.willAttend,
          attendees: formData.value.willAttend === 'yes' ? formData.value.attendees : 0,
          mealType: formData.value.willAttend === 'yes' ? formData.value.mealType : '',
          needChildSeat: formData.value.willAttend === 'yes' ? formData.value.needChildSeat : 'no',
          childSeatCount: formData.value.willAttend === 'yes' && formData.value.needChildSeat === 'yes' ? formData.value.childSeatCount : 0,
          needInvitation: formData.value.willAttend === 'yes' ? formData.value.needInvitation : 'no',
          invitationRecipient: formData.value.willAttend === 'yes' && formData.value.needInvitation === 'yes' ? formData.value.invitationRecipient : '',
          invitationAddress: formData.value.willAttend === 'yes' && formData.value.needInvitation === 'yes' ? formData.value.invitationAddress : '',
          invitationPhone: formData.value.willAttend === 'yes' && formData.value.needInvitation === 'yes' ? formData.value.invitationPhone : '',
          blessing: formData.value.blessing,
          note: formData.value.note
        }

        const response = await fetch('/api/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(dataToSubmit)
        })

        if (response.ok) {
          alert('表單送出成功!感謝您的回覆 ❤️')
          router.push('/')
        } else {
          throw new Error('送出失敗')
        }
      } catch (error) {
        console.error('送出錯誤:', error)
        alert('送出失敗,請稍後再試或聯絡我們')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      isSubmitting,
      relationshipOptions,
      formData,
      submitForm
    }
  }
}
