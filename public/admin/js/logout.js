document.getElementById('logoutButton').addEventListener('click', async(event)=>{
    event.preventDefault()

    //Show sweet alert with confirmation dialog...!
    const result = await Swal.fire({
        title: ' Do you want to logout..?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
         cancelButtonText: 'No!'
    });
    // If admin confirms , proceed with logout...!

    if(result.isConfirmed) {
        try{
            const response = await fetch ('/admin/logout', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application /json'
                }
            });
            if (! response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Logout failed');
            }
            const data = await response.json();
            Swal.fire({
                title: 'Logged Out!',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(()=>{
                window.location.href ='/admin/login'  // After success... redirect!
            })
        }catch (error) {
            console.error('An error occured during logout');
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            
        }
    }
} );