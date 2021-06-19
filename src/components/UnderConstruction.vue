<template>
    <div class="text-center sm:text-center mx-auto">
        <div class="text-center sm:text-center text-white text-9xl w-64 mt-64 mx-auto left-0.5 "><img :src="logo"/></div>
        <div class="text-center sm:text-center mt-8 flex lg:mt-0 lg:flex-shrink-0 mx-auto">
            <span class="type"><b class="text-green font-bold text-5xl">hacker.<b class="text-pink  font-bold text-5xl">&nbsp;capture.</b>&nbsp;flag.</b>
            </span></div>
            <div class="bg-transparent">
                <div class="text-center sm:text-center max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <div class="text-center sm:text-center mt-8 flex lg:mt-0 lg:flex-shrink-0 mx-auto ">
                        <div class="inline-flex rounded-md shadow ">
                            <a href="mailto:falecom@eflag.io" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-bold rounded-md text-eblue bg-white hover:bg-indigo-50">
                                <i class="fas fa-envelope"></i>&nbsp;Mande um email
                            </a>
                        </div>
                        <div class="ml-3 inline-flex rounded-md shadow">
                            <a href="https://www.instagram.com/eflag.io/" target="_blank" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-bold rounded-md text-eblue bg-white hover:bg-indigo-50">
                                <i class="fab fa-instagram"></i>&nbsp;Segue lá
                            </a>
                        </div>
                        <div class="ml-3 inline-flex rounded-md shadow">
                            <a href="http://github.com/eflag" target="_blank" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-bold rounded-md text-eblue bg-white hover:bg-indigo-60">
                                <i class="fab fa-github"></i>&nbsp;Segue lá
                            </a>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script setup>
import logo from '/eFlag.svg'
</script>

<style scoped>
.type{
    border-right: 1px solid rgba(255, 255, 255);
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
    white-space: nowrap;
    overflow: hidden;
    height: 4rem;
    animation: blinkcursor 500ms steps(40) infinite normal, 
    typing 6s steps(45) normal;
}

@keyframes blinkcursor {
    from{
        border-right-color: rgba(255, 255, 255);
    }
    to{
        border-right-color: transparent ;
    }
}

@keyframes typing {
    from{
        width: 0;
    }
    to{
        width: 30rem;
    }
}
</style>
