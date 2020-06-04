FROM mariadb/server:10.4

ENV MARIADB_ROOT_PASSWORD ROOT
ENV MARIADB_DATABASE dblatihan
ENV MARIADB_USER arvinyustin99
ENV MARIADB_PASSWORD arvinyustin99

COPY dblatihan.sql /docker-entrypoint-initdb.d/
EXPOSE 3306
CMD ["mysqld"]

